import { ADMIN_EVENT } from "./admin.model";

interface EventStructure {
    event: ADMIN_EVENT;
}

export interface Administrate extends EventStructure {
    event: ADMIN_EVENT.ADMINISTRATE;
    // TODO: Authentication
}

export interface SummaryRequest extends EventStructure {
    event: ADMIN_EVENT.SUMMARY_REQUEST;
    data: SummaryRequestData;
}

export interface SummaryRequestData {
    subscribe?: boolean;
}

export interface SummaryUnsubscribe extends EventStructure {
    event: ADMIN_EVENT.SUMMARY_UNSUBSCRIBE;
}

export type Event = Administrate | SummaryRequest | SummaryUnsubscribe;
export type EventData = SummaryRequestData;
