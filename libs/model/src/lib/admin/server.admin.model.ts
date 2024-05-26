export enum BaseServerAdminEvent {
    ADMINISTRATING = 'administrating',
    SUMMARY = 'summary',
}

export interface LipwigSummary {
    total: number;
    current: number;
    names: Record<string, {
        total: number;
        current: number;
    }>
}

export interface RoomSummary {
    id: string;
    name: string;
    active: boolean;
}

export interface RoomInfo {
    // TODO: Expand, like RoomQuery
    id: string;
    name: string;
    active: boolean;
}
