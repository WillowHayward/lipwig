export type CreateOptions = Partial<{
    size: number;
    name: string;
    password: string;
    approvals: boolean; // True for Host manually approving join requests
    required: string[]; // List of required paramaters to join a room
}>;

// Events sent from a Host to the Server
export enum BaseHostEvent {
    CREATE = 'create',
    JOIN_RESPONSE = 'join-response',
    LOCK = 'lock',
    UNLOCK = 'unlock',
    POLL = 'poll',
    KICK = 'lw-kick',
    RECONNECT = 'reconnect',
    LOCAL_JOIN = 'lw-local-join', // Used to register local client
    LOCAL_LEAVE = 'lw-local-leave', // Used to remove local client
}
