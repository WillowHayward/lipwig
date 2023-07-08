export enum MESSAGE_DIRECTION {
    TO = 0,
    FROM = 1
}

export type Log = {
    message: string;
    event: string;
    subevent?: string;
    socket?: string;
    room?: string;
}
