import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
    BaseClientErrorCode,
    BaseJoinErrorCode,
    CLIENT_EVENT,
    GENERIC_EVENT,
    GenericErrorCode,
    HOST_EVENT,
} from '@lipwig/model';
import { RoomService } from '../service/room.service';
import { LipwigSocket, AbstractSocket, HostSocket, ClientSocket, SOCKET_TYPE } from '../../socket';
import { Validator } from './guards.model';


@Injectable()
export class RoomGuard implements CanActivate {
    private socket: AbstractSocket;

    constructor(private reflector: Reflector, private rooms: RoomService) { }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const rawSocket: LipwigSocket = context.switchToWs().getClient();
        this.socket = rawSocket.socket;
        const event = this.reflector.get<string>(
            'message',
            context.getHandler()
        );
        const args: any = context.getArgs()[1];

        return this.validate(event, args);
    }

    private validate(event: string, args: any): boolean {
        if (!this.isValidEvent(event)) {
            this.socket.error(GenericErrorCode.MALFORMED, `Invalid event '${event}'`);
            return false;
        }

        const validator = this.getValidator(event);

        if (
            validator.required &&
            !this.validateParameters(args, validator.required)
        ) {
            return false;
        }

        if (validator.roomExists && !this.validateRoomExists(args.code)) {
            return false;
        }

        if (validator.validUser && !this.validateUser()) {
            return false;
        }

        if (validator.isHost !== undefined) {
            const isHost = this.socket.type === SOCKET_TYPE.HOST;
            if (!isHost && validator.isHost) {
                this.socket.error(BaseClientErrorCode.INSUFFICIENTPERMISSIONS);
                return false;
            } else if (isHost && !validator.isHost) {
                // TODO: Is this also just insufficient permissions?
                this.socket.error(
                    GenericErrorCode.MALFORMED,
                    `Cannot use event '${event}' as host`
                );
                return false;
            }
        }

        if (validator.other && !validator.other(args)) {
            return false;
        }

        return true;
    }

    private isValidEvent(event: string): event is CLIENT_EVENT {
        const genericEvents = Object.values(GENERIC_EVENT);
        if (genericEvents.includes(event as GENERIC_EVENT)) {
            return true;
        }

        const clientEvents = Object.values(CLIENT_EVENT);
        if (clientEvents.includes(event as CLIENT_EVENT)) {
            return true;
        }

        const hostEvents = Object.values(HOST_EVENT);
        if (hostEvents.includes(event as HOST_EVENT)) {
            return true;
        }

        this.socket.error(GenericErrorCode.MALFORMED, `No such event '${event}'`);
        return false;
    }

    private validateRoomExists(room: string): boolean {
        if (!room || !this.rooms.roomExists(room)) {
            this.socket.error(BaseJoinErrorCode.ROOMNOTFOUND);
            return false;
        }

        return true;
    }

    private validateParameters(args: any, required: string[]): boolean {
        const params = Object.keys(args);
        const missing = required.filter((param) => !params.includes(param));

        if (missing.length) {
            this.socket.error(
                GenericErrorCode.MALFORMED,
                `Missing required parameters: ${missing.join(', ')}`
            );
            return false;
        }

        return true;
    }

    private validateUser(): boolean {
        switch (this.socket.type) {
            case SOCKET_TYPE.ANONYMOUS:
                // socket improperly initialized
                this.socket.error(GenericErrorCode.MALFORMED);
                return false;
            case SOCKET_TYPE.ADMIN:
                // I'm not even sure how this would happen
                this.socket.error(GenericErrorCode.MALFORMED);
                return false;
        }

        const socket: HostSocket | ClientSocket = this.socket as HostSocket; //TODO: Try to make this more generic than hostsocket
        const room = socket.room;
        if (room.closed) {
            this.socket.error(BaseJoinErrorCode.ROOMCLOSED);
            return false;
        }

        return true;
    }

    private getValidator(event: CLIENT_EVENT | HOST_EVENT): Validator {
        // TODO: COnfirm all of these
        // TODO: holy shit rework this whole thing yo
        const hostValidators = new Map<HOST_EVENT, Validator>([
            // Host events
            [HOST_EVENT.CREATE, {}],
            [HOST_EVENT.PING_CLIENT, { required: ['time', 'id'], isHost: true }],
            [HOST_EVENT.PONG_HOST, { required: ['time', 'id'], isHost: true }],
            [HOST_EVENT.PING_SERVER, { required: ['time'] }],
            [HOST_EVENT.KICK, { required: ['id'], isHost: true }],
        ]);

        const clientValidators = new Map<CLIENT_EVENT, Validator>([
            // Client events
            [CLIENT_EVENT.JOIN, { required: ['code'], roomExists: true }],
            [CLIENT_EVENT.RECONNECT, { required: ['code', 'id'], roomExists: true }],
        ]);

        const genericValidators = new Map<GENERIC_EVENT, Validator>([
            [GENERIC_EVENT.MESSAGE, {
                required: ['event', 'args'],
                validUser: true,
                other: (args: any) => {
                    if (this.socket.type === SOCKET_TYPE.HOST && !args.recipients) {
                        this.socket.error(
                            GenericErrorCode.MALFORMED,
                            'Message from host must contain recipients'
                        );
                        return false;
                    } else if (this.socket.type !== SOCKET_TYPE.HOST && args.recipients) {
                        this.socket.error(
                            GenericErrorCode.MALFORMED,
                            'Message from client must not contain recipients'
                        );
                        return false;
                    }
                    return true;
                },
            }],
        ]);

        // TODO: thanks, i hate it
        const validators = new Map();
        hostValidators.forEach((v, k) => validators.set(k, v));
        clientValidators.forEach((v, k) => validators.set(k, v));
        genericValidators.forEach((v, k) => validators.set(k, v));

        if (!validators.has(event)) {
            console.warn(`Guard not set up for event '${event}'`);
            return {};
        }

        return validators.get(event);
    }
}
