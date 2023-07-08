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
