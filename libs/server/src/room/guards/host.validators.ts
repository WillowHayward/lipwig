import { HOST_EVENT } from "@lipwig/model";
import { Validator } from "./guards.model";

// TODO: Can you make this exhaustive? Maybe not at compile time, but could be worth it for runtime?
export const HostValidators: Map<HOST_EVENT, Validator> = new Map([
    [HOST_EVENT.CREATE, {}],
    [HOST_EVENT.PING_CLIENT, { required: ['time', 'id'], isHost: true }],
    [HOST_EVENT.PONG_HOST, { required: ['time', 'id'], isHost: true }],
    [HOST_EVENT.PING_SERVER, { required: ['time'] }],
    [HOST_EVENT.KICK, { required: ['id'], isHost: true }],
]);
