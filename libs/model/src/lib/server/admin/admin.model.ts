export enum SERVER_ADMIN_EVENT {
    ADMINISTRATING = 'administrating',
    SUMMARY = 'summary',
}

export type LipwigSummary = {
    total: number;
    current: number;
    names: Record<string, {
        total: number;
        current: number;
    }>
}

export type RoomSummary = {
    id: string;
    name: string;
    active: boolean;
}

export type RoomInfo = {
    // TODO: Expand, like RoomQuery
    id: string;
    name: string;
    active: boolean;
}
