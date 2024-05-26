import { BaseAdminEvent } from "./admin.model";

export type BaseAdminMessageData = {
    [BaseAdminEvent.ADMINISTRATE]: never;
    [BaseAdminEvent.SUMMARY_REQUEST]: SummaryRequestMessageData;
    [BaseAdminEvent.SUMMARY_UNSUBSCRIBE]: never;
}
export interface SummaryRequestMessageData {
    subscribe?: boolean;
}
