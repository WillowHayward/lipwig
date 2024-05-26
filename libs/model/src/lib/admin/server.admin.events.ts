import { LipwigSummary, BaseServerAdminEvent } from './server.admin.model';

export interface BaseServerAdminMessageData {
    [BaseServerAdminEvent.ADMINISTRATING]: never;
    [BaseServerAdminEvent.SUMMARY]: SummaryMessageData;
}

export interface SummaryMessageData {
    summary: LipwigSummary;
    subscribed: boolean;
}
