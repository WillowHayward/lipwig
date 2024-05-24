import { Injectable } from '@nestjs/common';

import {
    SERVER_GENERIC_EVENTS,
    ClientEvents,
    HostEvents,
    CreateOptions,
    JoinOptions,
    RoomQuery,
} from '@lipwig/model';

import { generateString } from '@lipwig/utils';

import { Room } from '../room.instance';
import { BANNED_WORDS } from '../../lipwig.model';
import { AnonymousSocket, HostSocket, ClientSocket } from '../../socket';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../../data/entities/room.entity';
import { Repository } from 'typeorm';
import { LipwigLogger } from '../../logging/logger/lipwig.logger';

// TODO: Make @SubscribeHostEvent and @SubscribeClientEvent method decorators
// TODO: Make exception which sends error?
@Injectable()
export class RoomService {
    private rooms: Map<string, Room> = new Map();
    private roomLimit = 0; // 0 for no limit

    constructor(
        @InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>,
        private logger: LipwigLogger
    ) { }

    getRoom(code: string): Room | undefined {
        return this.rooms.get(code);
    }

    roomExists(room: string): boolean {
        return this.rooms.has(room);
    }

    private withRoom<T>(socket: HostSocket | ClientSocket, callback: (room: Room) => T): T;
    private withRoom<T>(roomCode: string, callback: (room: Room) => T): T;
    private withRoom<T>(source: HostSocket | ClientSocket | string, callback: (room: Room) => T): T {
        const room = typeof source === 'string' ? this.getRoom(source) : source.room;
        if (!room) {
            throw new Error('ROOMNOTFOUND'); // TODO
        }
        return callback(room);
    }

    // TODO: Check if these util fns are used
    /*clientInRoom(room: string, id: string): boolean {
        return this.getRoomOrThrow(room).inRoom(id);
    }

    clientIsHost(room: string, id: string): boolean {
        return this.getRoomOrThrow(room).isHost(id);
    }*/

    create(socket: AnonymousSocket, config: CreateOptions = {}) {
        const existingCodes = new Set(this.rooms.keys());

        if (this.roomLimit) {
            if (existingCodes.size >= this.roomLimit) {
                // TODO: Implement room limit
                throw new Error('Max rooms reached');
            }
        }
        let code: string;
        do {
            code = generateString(4);
        } while (existingCodes.has(code) || BANNED_WORDS.has(code)); // TODO: Allow custom ban list
        const room = new Room(socket, code, config, this.roomRepository, this.logger);
        this.rooms.set(code, room);
        room.onclose = () => {
            this.rooms.delete(code);
        };
    }

    join(socket: AnonymousSocket, code: string, options: JoinOptions = {}) {
        // TODO: Join Options
        this.withRoom(code, room => room.join(socket, options));
    }

    rejoin(socket: AnonymousSocket, code: string, id: string) {
        this.withRoom(code, room => room.rejoin(socket, id));
    }

    joinResponse(
        host: HostSocket,
        id: string,
        response: boolean,
        reason?: string
    ) {
        this.withRoom(host, room => room.joinResponse(host, id, response, reason));
    }

    lock(host: HostSocket, reason?: string) {
        this.withRoom(host, room => room.lock(host, reason));
    }

    unlock(host: HostSocket) {
        this.withRoom(host, room => room.unlock(host));
    }

    reconnect(socket: AnonymousSocket, code: string, id: string): boolean {
        return this.withRoom(code, room => room.reconnect(socket, id));
    }

    //administrate(user: AbstractSocket, payload: AdministrateEventData) {}

    message(
        user: HostSocket | ClientSocket,
        payload: HostEvents.MessageData | ClientEvents.MessageData
    ) {
        this.withRoom(user, room => room.handle(user, payload));
    }

    poll(host: HostSocket, id: string, query: string, recipients: string[]) {
        this.withRoom(host, room => room.poll(host, id, query, recipients));
    }

    pollResponse(client: ClientSocket, id: string, response: any) {
        this.withRoom(client, room => room.pollResponse(client, id, response));
    }

    pingHost(client: ClientSocket, time: number) {
        this.withRoom(client, room => room.pingHost(client, time));
    }

    pongHost(host: HostSocket, time: number, id: string) {
        this.withRoom(host, room => room.pongHost(host, time, id));
    }

    pingClient(host: HostSocket, time: number, id: string) {
        this.withRoom(host, room => room.pingClient(host, time, id));
    }

    pongClient(client: ClientSocket, time: number) {
        this.withRoom(client, room => room.pongClient(client, time));
    }

    kick(host: HostSocket, id: string, reason?: string) {
        this.withRoom(host, room => room.kick(host, id, reason));
    }

    localJoin(host: HostSocket, id: string) {
        this.withRoom(host, room => room.localJoin(host, id));
    }

    localLeave(host: HostSocket, id: string) {
        this.withRoom(host, room => room.localLeave(host, id));
    }
}
