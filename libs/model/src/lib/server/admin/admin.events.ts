import { LipwigSummary, SERVER_ADMIN_EVENT } from "./admin.model";

interface EventStructure {
    event: SERVER_ADMIN_EVENT;
}

export interface Administrating extends EventStructure {
    event: SERVER_ADMIN_EVENT.ADMINISTRATING;
}

export interface Summary extends EventStructure {
    event: SERVER_ADMIN_EVENT.SUMMARY;
    data: SummaryData;
}

export interface SummaryData {
    summary: LipwigSummary;
    subscribed: boolean;
}

export type Event = Administrating | Summary;
export type EventData = SummaryData;
