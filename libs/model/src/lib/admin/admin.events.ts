import { BaseAdminEvent } from "./admin.model";

export interface BaseAdminMessageData {
    [BaseAdminEvent.ADMINISTRATE]: never;
    [BaseAdminEvent.SUMMARY_REQUEST]: SummaryRequestMessageData;
    [BaseAdminEvent.SUMMARY_UNSUBSCRIBE]: never;
}
export interface SummaryRequestMessageData {
    subscribe?: boolean;
}
