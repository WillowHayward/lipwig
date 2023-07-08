import { v4 } from 'uuid';
import {
    SERVER_HOST_EVENT,
    SERVER_CLIENT_EVENT,
    ERROR_CODE,
    CLOSE_CODE,
    HostEvents,
    ClientEvents,
    CreateOptions,
    JoinOptions,
    RoomQuery,
} from '@lipwig/model';
import { AnonymousSocket, HostSocket, ClientSocket, SOCKET_TYPE } from '../../socket';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../data/entities/room.entity';
import { RoomLogger } from '../../logging/logger/room.logger';
import { Loggers } from '../../logging/logger/loggers.singleton';

interface Poll {
    id: string;
    pending: string[];
    received: string[];
    open: boolean;
}

interface Pending {
    [id: string]: {
        client: AnonymousSocket;
        options: JoinOptions;
    };
}

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

    private host: HostSocket;
    private clients: ClientSocket[] = [];
    private pending: Pending = {};
    private localClients: string[] = [];

    private polls: Poll[] = [];

    private logger: RoomLogger;

    // TODO: This feels hacky
    public onclose: () => void = () => null;
    public closed = false;

    constructor(
        socket: AnonymousSocket,
        public code: string,
        config: CreateOptions,
        private repository: Repository<RoomEntity>,
    ) {
        // TODO: Room config
        const host = this.initializeHost(socket);
        this.host = host;

        this.name = config.name;
        if (config.password && config.password.length) {
            this.password = config.password;
        }

        this.required = config.required || [];
        this.approvals = config.approvals || false;

        this.size = config.size || 8; //TODO: Turn default into config

        this.initEntity();

        this.logger = Loggers.getRoomLogger();
        this.log('Created', `Host: ${host.id}`);
        host.send({
            event: SERVER_HOST_EVENT.CREATED,
            data: {
                code,
                id: host.id,
            },
        });
    }

    inRoom(id: string) {
        if (this.isHost(id)) {
            return true;
        }

        return this.clients.some((client) => id === client.id);
    }

    isHost(id: string) {
        return id === this.host.id;
    }

    query(id?: string): RoomQuery {
        let isProtected = false;
        const currentSize = this.clients.length + this.localClients.length; // TODO: THis is duplicated, could be a function
        const capacity = this.size - currentSize;
        if (this.password && this.password.length > 0) {
            isProtected = true;
        }

        let rejoin = false;
        if (id) {
            const client = this.clients.find(client => client.id === id);
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

    private initializeClient(client: AnonymousSocket, id?: string): ClientSocket {
        id = id || v4();
        const socket = client.socket;
        const logger = Loggers.getSocketLogger();
        const newClient = new ClientSocket(socket, id, logger, this);
        socket.socket = newClient;

        newClient.on('leave', (reason?: string) => {
            this.leave(newClient, reason);
        });

        newClient.on('disconnect', () => {
            this.disconnect(newClient);
        });

        return newClient;
    }

    private initializeHost(host: AnonymousSocket, id?: string): HostSocket {
        id = id || v4();
        const socket = host.socket;
        const logger = Loggers.getSocketLogger();
        const newHost = new HostSocket(socket, id, logger, this);
        socket.socket = newHost;

        newHost.on('close', (reason?: string) => {
            this.close(reason);
        });

        newHost.on('disconnect', () => {
            this.disconnect(newHost);
        });

        return newHost;
    }

    join(client: AnonymousSocket, options: JoinOptions) {
        if (this.password) {
            if (!options.password) {
                client.error(ERROR_CODE.INCORRECTPASSWORD, 'Password required');
                return;
            }
            if (this.password.localeCompare(options.password) !== 0) {
                client.error(ERROR_CODE.INCORRECTPASSWORD);
                return;
            }
        }

        if (this.locked) {
            client.error(ERROR_CODE.ROOMLOCKED, this.lockReason);
            return;
        }

        const currentSize = this.clients.length + this.localClients.length;
        if (currentSize >= this.size) {
            client.error(ERROR_CODE.ROOMFULL);
            return;
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
            client.error(
                ERROR_CODE.MISSINGPARAM,
                `Join request missing the following parameters: ${missing.join(
                    ', '
                )}`
            );
            return;
        }

        if (this.approvals) {
            const tempId = v4();
            this.log('Join Request', tempId);
            const pending = {
                client,
                options,
            };
            this.pending[tempId] = pending;

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

        this.log('Client Rejoined', id);
    }

    public joinResponse(
        host: HostSocket,
        id: string,
        response: boolean,
        reason?: string
    ) {
        const target = this.pending[id];
        if (!target) {
            host.error(ERROR_CODE.USERNOTFOUND);
            return;
        }

        if (response) {
            this.joinSuccess(target.client, target.options);
            return;
        }

        target.client.error(ERROR_CODE.REJECTED, reason);
        delete this.pending[id];
    }

    private joinSuccess(socket: AnonymousSocket, options: JoinOptions) {
        const client = this.initializeClient(socket);
        const id = client.id;
        this.clients.push(client);
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
        this.log('Joined', id);
    }

    public lock(host: HostSocket, reason?: string) {
        this.locked = true;
        this.lockReason = reason;
        this.log('Locked', reason);
    }

    public unlock(host: HostSocket) {
        this.locked = false;
        this.lockReason = undefined;
        this.log('Unlocked');
    }

    private disconnect(disconnected: HostSocket | ClientSocket) {
        disconnected.connected = false;
        if (disconnected.type === SOCKET_TYPE.HOST) {
            for (const client of this.clients) {
                client.send({
                    event: SERVER_CLIENT_EVENT.HOST_DISCONNECTED,
                });
            }
        } else {
            this.host.send({
                event: SERVER_HOST_EVENT.CLIENT_DISCONNECTED,
                data: {
                    id: disconnected.id,
                },
            });
        }
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
            this.log('Client Reconnected', id);
        }

        return true;
    }

    private reconnectHost(host: AnonymousSocket, id: string): boolean {
        this.host = this.initializeHost(host, id);

        this.host.send({
            event: SERVER_HOST_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id: this.host.id,
                users: this.clients.map((client) => client.id),
                local: this.localClients,
            },
        });

        for (const client of this.clients) {
            client.send({
                event: SERVER_CLIENT_EVENT.HOST_RECONNECTED,
                data: {
                    room: this.code,
                    id: this.host.id, // TODO: Why does this get sent?
                },
            });
        }

        this.log('Host reconnected');

        return true;
    }

    private reconnectClient(socket: AnonymousSocket, id: string): ClientSocket | void {
        const index = this.clients.findIndex((other) => other.id === id);
        if (index === -1) {
            // Could not find user
            socket.error(ERROR_CODE.USERNOTFOUND);
            return;
        }

        const existing = this.clients[index];
        if (existing.connected) {
            socket.error(ERROR_CODE.ALREADYCONNECTED);
            return;
        }

        const client = this.initializeClient(socket, id);

        this.clients.splice(index, 1, client);

        return client;
    }

    close(reason?: string) {
        this.closed = true;
        for (const client of this.clients) {
            client.close(CLOSE_CODE.CLOSED, reason);
        }

        this.log('Closed', reason);

        const closedAt = (new Date()).getTime();

        this.entity.closedAt = closedAt;
        this.entity.closed = true;
        this.saveEntity();

        if (this.onclose) {
            this.onclose();
        }
    }

    leave(client: ClientSocket, reason?: string) {
        this.host.send({
            event: SERVER_HOST_EVENT.LEFT,
            data: {
                id: client.id,
                reason,
            },
        });

        const index = this.clients.indexOf(client);
        if (index === -1) {
            // TODO: Handle
            return;
        }

        this.log('Client Left', [client.id, reason].join(' - '));

        this.clients.splice(index, 1);
        this.syncClients();
    }

    kick(host: HostSocket, id: string, reason?: string) {
        if (host.type !== SOCKET_TYPE.HOST) {
            host.error(ERROR_CODE.INSUFFICIENTPERMISSIONS);
            return;
        }

        const target = this.clients.find((client) => client.id === id);
        if (!target) {
            host.error(ERROR_CODE.USERNOTFOUND);
            return;
        }

        const index = this.clients.indexOf(target);
        if (index === -1) {
            host.error(ERROR_CODE.USERNOTFOUND);
            return;
        }

        this.log('Client Kicked', [id, reason].join(' - '));

        target.close(CLOSE_CODE.KICKED, reason);
        this.clients.splice(index, 1);
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
        this.log('Message From Host', data.event);
        for (const id of data.recipients) {
            //TODO: Disconnected message queuing
            const client = this.clients.find((value) => id === value.id);
            if (!client) {
                host.error(ERROR_CODE.USERNOTFOUND);
                continue;
            }

            this.logSubevent('Message To Client', client.id, data.event);
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
        this.log('Message From Client', data.event);
        this.host.send({
            event: SERVER_HOST_EVENT.MESSAGE,
            data: {
                event: data.event,
                sender: client.id,
                args: data.args,
            },
        });
    }

    poll(host: HostSocket, id: string, query: string, recipients: string[]) {
        const poll: Poll = {
            id,
            pending: recipients,
            received: [],
            open: true,
        };

        this.polls.push(poll);

        for (const clientId of recipients) {
            const client = this.clients.find((client) => client.id === clientId);
            if (!client) {
                host.error(ERROR_CODE.USERNOTFOUND);
                continue;
            }

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
        const poll = this.polls.find((poll) => poll.id === id);
        if (!poll) {
            client.error(ERROR_CODE.POLLNOTFOUND);
            return;
        }

        const clientId = client.id;

        if (poll.received.includes(clientId)) {
            client.error(ERROR_CODE.POLLALREADYRESPONSED);
            return;
        }

        if (!poll.pending.includes(clientId)) {
            client.error(ERROR_CODE.POLLUSERNOTFOUND);
            return;
        }

        if (!poll.open) {
            client.error(ERROR_CODE.POLLCLOSED);
            return;
        }

        const clientIndex = poll.pending.indexOf(clientId);
        poll.pending.splice(clientIndex, 1);
        poll.received.push(clientId);

        if (!poll.pending.length) {
            poll.open = false;
        }

        this.host.send({
            event: SERVER_HOST_EVENT.POLL_RESPONSE,
            data: {
                id,
                client: clientId,
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
        const client = this.clients.find((client) => client.id === id);

        if (!client) {
            host.error(ERROR_CODE.USERNOTFOUND);
            return;
        }

        client.send({
            event: SERVER_CLIENT_EVENT.PONG_HOST,
            data: {
                time,
            },
        });
    }

    pingClient(host: HostSocket, time: number, id: string) {
        const client = this.clients.find((client) => client.id === id);

        if (!client) {
            host.error(ERROR_CODE.USERNOTFOUND);
            return;
        }

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
        this.log('Local Joined', id);
        this.localClients.push(id);
        this.syncClients(id);
    }

    localLeave(host: HostSocket, id: string) {
        const index = this.localClients.indexOf(id);

        if (index === -1) {
            host.error(ERROR_CODE.USERNOTFOUND, `Local user ${id} not found`);
        }

        this.localClients.splice(index, 1);
        this.syncClients();
        this.log('Local Left', id);
    }

    private log(event: string, message = '') {
        this.logSubevent(event, message);
    }

    private logSubevent(event: string, message: string, subevent?: string) {
        this.logger.log({
            room: this.id,
            event,
            subevent,
            message
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
        currentClients.push(...this.clients.map(client => client.id));
        currentClients.push(...this.localClients);
        this.entity.currentClients = currentClients;

        if (add) {
            this.entity.clients.push(add);
        }

        this.saveEntity();
    }

}
