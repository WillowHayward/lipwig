import { v4 } from 'uuid';
import {
    SERVER_HOST_EVENT,
    SERVER_CLIENT_EVENT,
    CLOSE_CODE,
    HostEvents,
    ClientEvents,
    CreateOptions,
    JoinOptions,
    RoomQuery,
    ROOM_LOG_EVENT,
    LOG_TYPE,
    BaseJoinErrorCode,
    BaseRejoinErrorCode,
    BaseClientErrorCode,
    BaseHostErrorCode,
} from '@lipwig/model';
import { AnonymousSocket, HostSocket, ClientSocket, SOCKET_TYPE, LipwigSocket } from '../socket';
import { Repository } from 'typeorm';
import { RoomEntity } from '../data/entities/room.entity';
import { LipwigLogger } from '../logging/logger/lipwig.logger';
import { PollManager } from './poll/poll.manager';
import { ClientManager } from './client/client.manager';
import { ClientError, HostError, JoinError, RejoinError } from './errors';

export class Room {
    public id = v4();
    private locked = false;
    private lockReason: string | undefined;

    private entity: RoomEntity;

    private name?: string;
    private password?: string;
    private size: number;
    private required: string[];
    private approvals: boolean;

    private pollManager: PollManager = new PollManager();
    private clientManager: ClientManager = new ClientManager();
    private host: HostSocket;

    private timeoutListener: ReturnType<typeof setTimeout>;

    // TODO: This feels hacky
    public onclose: () => void = () => null;
    public closed = false;

    constructor(
        socket: AnonymousSocket,
        public code: string,
        config: CreateOptions,
        private repository: Repository<RoomEntity>,
        private logger: LipwigLogger,
    ) {
        this.clientManager = new ClientManager();
        this.host = this.initializeHost(socket);
        // TODO: Room config
        this.name = config.name;
        if (config.password && config.password.length) {
            this.password = config.password;
        }

        this.required = config.required || [];
        this.approvals = config.approvals || false;

        this.size = config.size || 8; //TODO: Turn default into config

        this.initEntity();

        this.log(ROOM_LOG_EVENT.CREATED, `Host: ${this.host.id}`);
        this.host.send({
            event: SERVER_HOST_EVENT.CREATED,
            data: {
                code,
                id: this.host.id,
            },
        });
    }

    inRoom(id: string) {
        return this.isHost(id) || this.clientManager.clientExists(id);
    }

    isHost(id: string) {
        return id === this.host.id;
    }

    query(id?: string): RoomQuery {
        let isProtected = false;
        const currentSize = this.clientManager.clientCount;
        const capacity = this.size - currentSize;
        if (this.password && this.password.length > 0) {
            isProtected = true;
        }

        let rejoin = false;
        if (id) {
            const client = this.clientManager.findClient(id);
            if (client && !client.connected) {
                rejoin = true;
            }
        }

        return {
            exists: true,
            room: this.code,
            name: this.name,
            protected: isProtected,
            capacity,
            locked: this.locked,
            lockReason: this.lockReason,
            rejoin
        };
    }

    private initializeSocket<T extends ClientSocket | HostSocket>(
        socketClass: new (socket: LipwigSocket, id: string, logger: LipwigLogger, room: Room) => T,
        anonymousSocket: AnonymousSocket,
        id?: string
    ): T {
        id = id || v4();
        const { socket } = anonymousSocket;
        const newSocket = new socketClass(socket, id, this.logger, this);
        socket.socket = newSocket;

        newSocket.on('disconnect', () => {
            this.disconnect(newSocket);
        });

        return newSocket;
    }

    private initializeClient(client: AnonymousSocket, id?: string): ClientSocket {
        const newClient = this.initializeSocket(ClientSocket, client, id);

        newClient.on('leave', (reason?: string) => {
            this.leave(newClient, reason);
        });

        return newClient;
    }

    private initializeHost(host: AnonymousSocket, id?: string): HostSocket {
        const newHost = this.initializeSocket(HostSocket, host, id);

        newHost.on('close', (reason?: string) => {
            this.close(reason);
        });

        return newHost;
    }

    join(client: AnonymousSocket, options: JoinOptions) {
        if (this.password) {
            if (!options.password) {
                throw new JoinError(BaseJoinErrorCode.INCORRECTPASSWORD, 'Password required'); // TODO: Missing param? Actually probs dedicated "missing password" code
            }
            if (this.password.localeCompare(options.password) !== 0) {
                throw new JoinError(BaseJoinErrorCode.INCORRECTPASSWORD);
            }
        }

        if (this.locked) {
            throw new JoinError(BaseJoinErrorCode.ROOMLOCKED, this.lockReason);
        }

        if (this.clientManager.clientCount >= this.size) {
            throw new JoinError(BaseJoinErrorCode.ROOMFULL);
        }

        if (!options.data) {
            options.data = {};
        }

        const missing: string[] = [];
        for (const param of this.required) {
            if (!(param in options.data)) {
                missing.push(param);
            }
        }

        if (missing.length) {
            throw new JoinError(BaseJoinErrorCode.MISSINGPARAM,
                `Join request missing the following parameters: ${missing.join(
                    ', '
                )}`
            );
        }

        if (this.approvals) {
            const tempId = v4();
            this.log(ROOM_LOG_EVENT.JOIN_REQUEST, tempId);
            this.clientManager.addPending(tempId, client, options);

            this.host.send({
                event: SERVER_HOST_EVENT.JOIN_REQUEST,
                data: {
                    id: tempId,
                    data: options.data,
                },
            });
            return;
        }

        this.joinSuccess(client, options);
    }

    public rejoin(socket: AnonymousSocket, id: string) {
        const client = this.reconnectClient(socket, id)
        if (!client) {
            return;
        }

        client.send({
            event: SERVER_CLIENT_EVENT.REJOINED,
            data: {
                id,
                name: this.name,
            },
        });
        // Send to user first to allow listeners to be in localhost
        // TODO: This may still introduce a race condition
        this.host.send({
            event: SERVER_HOST_EVENT.REJOINED,
            data: {
                id: client.id,
            },
        });

        this.log(ROOM_LOG_EVENT.CLIENT_REJOINED, id);
    }

    public joinResponse(
        host: HostSocket,
        id: string,
        response: boolean,
        reason?: string
    ) {
        const target = this.clientManager.findAndRemovePendingOrThrow(id);
        if (response) {
            this.joinSuccess(target.socket, target.options);
        } else {
            throw new JoinError(BaseJoinErrorCode.REJECTED, reason);
        }

    }

    private joinSuccess(socket: AnonymousSocket, options: JoinOptions) {
        const client = this.initializeClient(socket);
        const id = client.id;
        this.clientManager.addClient(client);
        this.syncClients(id);

        client.send({
            event: SERVER_CLIENT_EVENT.JOINED,
            data: {
                id,
                name: this.name,
            },
        });

        this.host.send({
            event: SERVER_HOST_EVENT.JOINED,
            data: {
                id,
                data: options?.data,
            },
        });
        this.log(ROOM_LOG_EVENT.CLIENT_JOINED, id);
    }

    public lock(host: HostSocket, reason?: string) {
        this.locked = true;
        this.lockReason = reason;
        this.log(ROOM_LOG_EVENT.LOCKED, reason);
    }

    public unlock(host: HostSocket) {
        this.locked = false;
        this.lockReason = undefined;
        this.log(ROOM_LOG_EVENT.UNLOCKED);
    }

    private disconnect(disconnected: HostSocket | ClientSocket) {
        disconnected.connected = false;
        if (disconnected.type === SOCKET_TYPE.HOST) {
            const clients = this.clientManager.getClients();
            for (const client of clients) {
                client.send({
                    event: SERVER_CLIENT_EVENT.HOST_DISCONNECTED,
                });
            }
            // TODO: Should this also lock the room?
            this.timeoutListener = setTimeout(() => {
                this.close('Host Timeout'); // TODO: Should this have its own event?
            }, 1000 * 60 * 10); // 10 minutes // TODO: Make configurable
        } else {
            this.host.send({
                event: SERVER_HOST_EVENT.CLIENT_DISCONNECTED,
                data: {
                    id: disconnected.id,
                },
            });
        }
        this.log(ROOM_LOG_EVENT.HOST_DISCONNECTED);
    }

    reconnect(socket: AnonymousSocket, id: string): boolean {
        if (this.isHost(id)) {
            if (!this.reconnectHost(socket, id)) {
                return false;
            }
        } else {
            const client = this.reconnectClient(socket, id);
            if (!client) {
                return false;
            }
            client.send({
                event: SERVER_CLIENT_EVENT.RECONNECTED,
                data: {
                    room: this.code,
                    id,
                },
            });
            // Send to user first to allow listeners to be in localhost
            // TODO: This may still introduce a race condition
            this.host.send({
                event: SERVER_HOST_EVENT.CLIENT_RECONNECTED,
                data: {
                    room: this.code,
                    id: client.id,
                },
            });
            this.log(ROOM_LOG_EVENT.CLIENT_RECONNECTED, id);
        }

        return true;
    }

    private reconnectHost(host: AnonymousSocket, id: string): boolean {
        this.host = this.initializeHost(host, id);
        clearTimeout(this.timeoutListener);

        this.host.send({
            event: SERVER_HOST_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id: this.host.id,
                users: this.clientManager.getClientIds(),
                local: this.clientManager.getLocalClientIds()
                // TODO: Pending?
            },
        });

        const clients = this.clientManager.getClients();
        for (const client of clients) {
            client.send({
                event: SERVER_CLIENT_EVENT.HOST_RECONNECTED,
                data: {
                    room: this.code,
                    id: this.host.id, // TODO: Why does this get sent?
                },
            });

        }

        this.log(ROOM_LOG_EVENT.HOST_RECONNECTED);

        return true;
    }

    private reconnectClient(socket: AnonymousSocket, id: string): ClientSocket {

        const existing = this.clientManager.findClientOrThrow(id);
        if (existing.connected) {
            // TODO: Confirm if this can only be trigger by a Client
            throw new RejoinError(BaseRejoinErrorCode.ALREADYCONNECTED);
        }

        const client = this.initializeClient(socket, id);

        this.clientManager.setClient(client);

        return client;
    }

    close(reason?: string) {
        this.closed = true;
        const clients = this.clientManager.getClients();
        for (const client of clients) {
            client.close(CLOSE_CODE.CLOSED, reason);
        }

        this.log(ROOM_LOG_EVENT.CLOSED, reason);

        const closedAt = (new Date()).getTime();

        this.entity.closedAt = closedAt;
        this.entity.closed = true;
        this.saveEntity();

        this.onclose?.(); // TODO: Like, verify this
    }

    leave(client: ClientSocket, reason?: string) {
        // TODO: Does this need to handle the given client not being in the room? Surely a guard will be handling that
        this.host.send({
            event: SERVER_HOST_EVENT.LEFT,
            data: {
                id: client.id,
                reason,
            },
        });

        this.clientManager.removeClient(client);

        this.log(ROOM_LOG_EVENT.CLIENT_LEFT, [client.id, reason].join(' - '));
        this.syncClients();
    }

    kick(host: HostSocket, id: string, reason?: string) {
        // TODO: Move this to a guard. There should be a list of privileged actions which can only be taken by the HostSocket
        if (host.type !== SOCKET_TYPE.HOST) {
            throw new ClientError(BaseClientErrorCode.INSUFFICIENTPERMISSIONS);
        }

        const client = this.clientManager.findClientOrThrow(id);

        this.log(ROOM_LOG_EVENT.CLIENT_KICKED, [id, reason].join(' - '));

        client.close(CLOSE_CODE.KICKED, reason);
        this.clientManager.removeClient(client);
        this.syncClients();
    }


    handle(
        sender: HostSocket | ClientSocket,
        data: HostEvents.MessageData | ClientEvents.MessageData
    ) {
        if (sender.type === SOCKET_TYPE.HOST) {
            this.handleHost(sender as HostSocket, data as HostEvents.MessageData);
        } else {
            this.handleClient(sender as ClientSocket, data as ClientEvents.MessageData);
        }
    }

    private handleHost(host: HostSocket, data: HostEvents.MessageData) {
        this.log(ROOM_LOG_EVENT.HOST_MESSAGE, `Recipients: ${data.recipients.join(', ')}`, data.event);
        const [clients, missing] = this.clientManager.findClientsAndMissing(data.recipients);
        if (missing.length) {
            // TODO: DOes this warrant a "USERSNOTFOUND" error? Distinct from user singular
            // CONT: No, I think just make the text more consistent across errors - it doesn't need to be plain english
            throw new HostError(BaseHostErrorCode.USERNOTFOUND, `User ${missing.join(', ')} not found`);
        }
        for (const client of clients) {
            client.send({
                event: SERVER_CLIENT_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    args: data.args,
                },
            });
        }
    }

    private handleClient(client: ClientSocket, data: ClientEvents.MessageData) {
        this.log(ROOM_LOG_EVENT.CLIENT_MESSAGE, data.event);
        this.host.send({
            event: SERVER_HOST_EVENT.MESSAGE,
            data: {
                event: data.event,
                sender: client.id,
                args: data.args,
            },
        });
    }

    // TODO: Method to close poll? Option to timeout poll? DISCUSS
    poll(host: HostSocket, id: string, query: string, recipients: string[]) {
        // NOTE: This throws USERNOTFOUND before it'll throw POLLALREADYEXISTS
        const [clients, missing] = this.clientManager.findClientsAndMissing(recipients);
        if (missing.length) {
            // TODO: DOes this warrant a "USERSNOTFOUND" error? Distinct from user singular
            // CONT: No, I think just make the text more consistent across errors - it doesn't need to be plain english
            throw new HostError(BaseHostErrorCode.USERNOTFOUND, `User ${missing.join(', ')} not found`);
        }

        this.pollManager.createPoll(id, clients);

        for (const client of clients) {
            client.send({
                event: SERVER_CLIENT_EVENT.POLL,
                data: {
                    id,
                    query,
                },
            });
        }
    }

    pollResponse(client: ClientSocket, id: string, response: unknown) {
        const poll = this.pollManager.findPollOrThrow(id);
        poll.markResponded(client);

        this.host.send({
            event: SERVER_HOST_EVENT.POLL_RESPONSE,
            data: {
                id,
                client: client.id,
                response,
            },
        });
    }

    pingHost(client: ClientSocket, time: number) {
        const id = client.id;

        this.host.send({
            event: SERVER_HOST_EVENT.PING_HOST,
            data: {
                time,
                id,
            },
        });
    }

    pongHost(host: HostSocket, time: number, id: string) {
        const client = this.clientManager.findClientOrThrow(id);

        client.send({
            event: SERVER_CLIENT_EVENT.PONG_HOST,
            data: {
                time,
            },
        });
    }

    pingClient(host: HostSocket, time: number, id: string) {
        const client = this.clientManager.findClientOrThrow(id);

        client.send({
            event: SERVER_CLIENT_EVENT.PING_CLIENT,
            data: {
                time,
            },
        });
    }

    pongClient(client: ClientSocket, time: number) {
        const id = client.id;

        this.host.send({
            event: SERVER_HOST_EVENT.PONG_CLIENT,
            data: {
                time,
                id,
            },
        });
    }

    localJoin(host: HostSocket, id: string) {
        this.log(ROOM_LOG_EVENT.LOCAL_JOINED, id);
        this.clientManager.addLocalClient(id);
        this.syncClients(id);
    }

    localLeave(host: HostSocket, id: string) {
        this.clientManager.removeLocalClient(id);
        this.syncClients();
        this.log(ROOM_LOG_EVENT.LOCAL_LEFT, id);
    }

    private log(event: ROOM_LOG_EVENT, data?: string, subevent?: string) {
        this.logger.log({
            type: LOG_TYPE.ROOM,
            id: this.id,
            event,
            subevent,
            data
        });
    }

    // Database functions
    private initEntity() {
        const createdAt = (new Date()).getTime();
        this.entity = this.repository.create({
            uid: this.id,
            code: this.code,
            createdAt,
            host: this.host.id,
            clients: [],
            currentClients: [],
            closed: false,

            name: this.name,
            size: this.size,
            password: this.password
        });
        this.saveEntity();
    }

    private saveEntity() {
        // BUG: This is currently creating new entries each time
        this.repository.save(this.entity);
    }

    private syncClients(add?: string) {
        const currentClients: string[] = [];
        currentClients.push(...this.clientManager.getClientIds());
        currentClients.push(...this.clientManager.getLocalClientIds());
        this.entity.currentClients = currentClients;

        if (add) {
            this.entity.clients.push(add);
        }

        this.saveEntity();
    }

}
