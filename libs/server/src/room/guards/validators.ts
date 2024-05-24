/*import { CLIENT_EVENT, HOST_EVENT } from "@lipwig/model";
import { Validator } from "./guards.model";

// TODO: COnfirm all of these
const hostValidators: Map<HOST_EVENT, Validator> = new Map([
    // Host events
    [HOST_EVENT.CREATE, {}],
    [HOST_EVENT.PING_CLIENT, { required: ['time', 'id'], isHost: true }],
    [HOST_EVENT.PONG_HOST, { required: ['time', 'id'], isHost: true }],
    [HOST_EVENT.PING_SERVER, { required: ['time'] }],
    [HOST_EVENT.KICK, { required: ['id'], isHost: true }],
]);

const clientValidators: Map<CLIENT_EVENT, Validator> = new Map([
    // Client events
    [CLIENT_EVENT.JOIN, { required: ['code'], roomExists: true }],
    [CLIENT_EVENT.RECONNECT, { required: ['code', 'id'], roomExists: true }],
    [CLIENT_EVENT.MESSAGE, {
        required: ['event', 'args'],
        validUser: true,
        other: (args: any) => {
            if (this.socket.type === SOCKET_TYPE.HOST && !args.recipients) {
                this.socket.error(
                    ERROR_CODE.MALFORMED,
                    'Message from host must contain recipients'
                );
                return false;
            } else if (this.socket.type !== SOCKET_TYPE.HOST && args.recipients) {
                this.socket.error(
                    ERROR_CODE.MALFORMED,
                    'Message from client must not contain recipients'
                );
                return false;
            }
            return true;
        },
    }],
]);

export const validators = new Map([...hostValidators, ...clientValidators]);*/
