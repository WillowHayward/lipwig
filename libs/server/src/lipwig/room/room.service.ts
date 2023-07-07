import { Injectable } from '@nestjs/common';

import {
    SERVER_GENERIC_EVENTS,
    ERROR_CODE,
    ClientEvents,
    HostEvents,
    CreateOptions,
    JoinOptions,
    RoomQuery,
} from '@lipwig/model';

import { generateString } from '@lipwig/utils';

import { Room } from '../classes/Room';
import { BANNED_WORDS } from '../../common/lipwig.model';
import { UninitializedSocket } from '../../common/classes/UninitializedSocket';
import { HostSocket } from '../classes/HostSocket';
import { ClientSocket } from '../classes/ClientSocket';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../../logging/entities/room.entity';
import { Repository } from 'typeorm';

// TODO: Make @SubscribeHostEvent and @SubscribeClientEvent method decorators
// TODO: Make exception which sends error?
@Injectable()
export class RoomService {
    private rooms: Record<string, Room> = {};
    private roomLimit = 0; // 0 for no limit

    constructor(
        @InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>
    ) { }

    getRoom(room: string): Room {
        return this.rooms[room];
    }

    getRooms(): Record<string, Room> {
        return this.rooms;
    }

    roomExists(room: string): boolean {
        if (this.getRoom(room)) {
            return true;
        }

        return false;
    }

    // TODO: Check if these util fns are used
    clientInRoom(room: string, id: string): boolean {
        return this.getRoom(room).inRoom(id);
    }

    clientIsHost(room: string, id: string): boolean {
        return this.getRoom(room).isHost(id);
    }

    query(socket: UninitializedSocket, code: string, id?: string) {
        let response: RoomQuery;
        if (!this.roomExists(code)) {
            response = {
                exists: false,
                room: code,
            };
        } else {
            const room = this.getRoom(code);
            response = room.query(id);
        }

        socket.send({
            event: SERVER_GENERIC_EVENTS.QUERY_RESPONSE,
            data: response,
        });
    }

    create(socket: UninitializedSocket, config: CreateOptions = {}) {
        const existingCodes = Object.keys(this.rooms);

        if (this.roomLimit) {
            if (existingCodes.length >= this.roomLimit) {
                // TODO: Implement room limit
                return;
            }
        }
        let code: string;
        do {
            code = generateString(4);
        } while (existingCodes.includes(code) || BANNED_WORDS.includes(code)); // TODO: Allow custom ban list
        const room = new Room(socket, code, config, this.roomRepository);
        this.rooms[code] = room;
        room.onclose = () => {
            delete this.rooms[code];
        };
    }

    join(socket: UninitializedSocket, code: string, options: JoinOptions = {}) {
        // TODO: Join Options
        const room = this.getRoom(code);

        if (!room) {
            socket.error(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.join(socket, options);
    }

    rejoin(socket: UninitializedSocket, code: string, id: string) {
        const room = this.getRoom(code);

        if (!room) {
            socket.error(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.rejoin(socket, id);
    }

    joinResponse(
        host: HostSocket,
        id: string,
        response: boolean,
        reason?: string
    ) {
        const room = host.room;
        room.joinResponse(host, id, response, reason);
    }

    lock(host: HostSocket, reason?: string) {
        const room = host.room;
        room.lock(host, reason);
    }

    unlock(host: HostSocket) {
        const room = host.room;
        room.unlock(host);
    }

    reconnect(socket: UninitializedSocket, code: string, id: string): boolean {
        const room = this.getRoom(code);

        return room.reconnect(socket, id);
    }

    //administrate(user: AbstractSocket, payload: AdministrateEventData) {}

    message(
        user: HostSocket | ClientSocket,
        payload: HostEvents.MessageData | ClientEvents.MessageData
    ) {
        const room = user.room;
        room.handle(user, payload);
    }

    poll(host: HostSocket, id: string, query: string, recipients: string[]) {
        const room = host.room;
        room.poll(host, id, query, recipients);
    }

    pollResponse(client: ClientSocket, id: string, response: any) {
        const room = client.room;
        room.pollResponse(client, id, response);
    }

    pingHost(client: ClientSocket, time: number) {
        const room = client.room;
        room.pingHost(client, time);
    }

    pongHost(host: HostSocket, time: number, id: string) {
        const room = host.room;
        room.pongHost(host, time, id);
    }

    pingClient(host: HostSocket, time: number, id: string) {
        const room = host.room;
        room.pingClient(host, time, id);
    }

    pongClient(client: ClientSocket, time: number) {
        const room = client.room;
        room.pongClient(client, time);
    }

    kick(host: HostSocket, id: string, reason?: string) {
        const room = host.room;
        room.kick(host, id, reason);
    }

    localJoin(host: HostSocket, id: string) {
        const room = host.room;
        room.localJoin(host, id);
    }

    localLeave(host: HostSocket, id: string) {
        const room = host.room;
        room.localLeave(host, id);
    }
}
