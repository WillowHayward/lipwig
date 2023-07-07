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

import { LipwigSocket } from '../classes/LipwigSocket';
import { Room } from '../classes/Room';
import { BANNED_WORDS } from '../../common/lipwig.model';
import { Observable, Subject } from 'rxjs';

// TODO: Make @SubscribeHostEvent and @SubscribeClientEvent method decorators
// TODO: Make exception which sends error?
@Injectable()
export class RoomService {
    private rooms: { [code: string]: Room } = {};
    private roomLimit = 0; // 0 for no limit
    private creationObservable: Subject<Room>;
    private closeObservable: Subject<Room>;

    constructor() {
        this.creationObservable = new Subject<Room>();
        this.closeObservable = new Subject<Room>();
    }

    getRoom(room: string): Room {
        return this.rooms[room];
    }

    roomExists(room: string): boolean {
        if (this.getRoom(room)) {
            return true;
        }

        return false;
    }

    userInRoom(room: string, id: string): boolean {
        return this.getRoom(room).inRoom(id);
    }

    userIsHost(room: string, id: string): boolean {
        return this.getRoom(room).isHost(id);
    }

    subscribe(): Observable<Room>;
    subscribe(room: string): Observable<unknown>;
    subscribe(room?: string): Observable<Room | unknown> {
        return this.creationObservable;
    }

    query(socket: LipwigSocket, code: string, id?: string) {
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

    create(user: LipwigSocket, config: CreateOptions = {}) {
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
        const room = new Room(user, code, config);
        this.rooms[code] = room;
        this.creationObservable.next(room);
        room.onclose = () => {
            this.closeObservable.next(room);
            delete this.rooms[code];
        };
    }

    join(user: LipwigSocket, code: string, options: JoinOptions = {}) {
        // TODO: Join Options
        const room = this.getRoom(code);

        if (!room) {
            user.error(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.join(user, options);
    }

    rejoin(user: LipwigSocket, code: string, id: string) {
        const room = this.getRoom(code);

        if (!room) {
            user.error(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.rejoin(user, id);
    }

    joinResponse(
        user: LipwigSocket,
        id: string,
        response: boolean,
        reason?: string
    ) {
        const room = user.room;
        room.joinResponse(user, id, response, reason);
    }

    lock(user: LipwigSocket, reason?: string) {
        const room = user.room;
        room.lock(user, reason);
    }

    unlock(user: LipwigSocket) {
        const room = user.room;
        room.unlock(user);
    }

    reconnect(user: LipwigSocket, code: string, id: string): boolean {
        const room = this.getRoom(code);

        return room.reconnect(user, id);
    }

    //administrate(user: LipwigSocket, payload: AdministrateEventData) {}

    message(
        user: LipwigSocket,
        payload: HostEvents.MessageData | ClientEvents.MessageData
    ) {
        const room = user.room;
        room.handle(user, payload);
    }

    poll(user: LipwigSocket, id: string, query: string, recipients: string[]) {
        const room = user.room;
        room.poll(user, id, query, recipients);
    }

    pollResponse(user: LipwigSocket, id: string, response: any) {
        const room = user.room;
        room.pollResponse(user, id, response);
    }

    pingHost(user: LipwigSocket, time: number) {
        const room = user.room;
        room.pingHost(user, time);
    }

    pongHost(user: LipwigSocket, time: number, id: string) {
        const room = user.room;
        room.pongHost(user, time, id);
    }

    pingClient(user: LipwigSocket, time: number, id: string) {
        const room = user.room;
        room.pingClient(user, time, id);
    }

    pongClient(user: LipwigSocket, time: number) {
        const room = user.room;
        room.pongClient(user, time);
    }

    kick(user: LipwigSocket, id: string, reason?: string) {
        const room = user.room;
        room.kick(user, id, reason);
    }

    localJoin(user: LipwigSocket, id: string) {
        const room = user.room;
        room.localJoin(user, id);
    }

    localLeave(user: LipwigSocket, id: string) {
        const room = user.room;
        room.localLeave(user, id);
    }
}
