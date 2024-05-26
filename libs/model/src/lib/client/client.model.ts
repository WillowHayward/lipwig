export const DEFAULTS = {
    port: 8989, //TODO: Is this needed?
};

export type JoinOptions = Partial<{
    data: Record<string, unknown>;
    password: string;
}>;

export enum BaseClientEvent {
    JOIN = 'join',
    REJOIN = 'rejoin',
    POLL_RESPONSE = 'poll-response',
    RECONNECT = 'reconnect',
}

