import { CommonEvent } from "../common";
import { BaseAdminEvent } from "./admin.model";

// All admin -> server events. Should match keys of AdminMessageData
export const AdminEvent = {
    ADMINISTRATE: BaseAdminEvent.ADMINISTRATE,
    SUMMARY_REQUEST: BaseAdminEvent.SUMMARY_REQUEST,
    SUMMARY_UNSUBSCRIBE: BaseAdminEvent.SUMMARY_UNSUBSCRIBE,
} as const;

export interface AdminEventData {
    [BaseAdminEvent.ADMINISTRATE]: never;
    [BaseAdminEvent.SUMMARY_REQUEST]: SummaryRequestMessageData;
    [BaseAdminEvent.SUMMARY_UNSUBSCRIBE]: never;
    [CommonEvent.MESSAGE]: never; // TODO: Currently including for completeness, determine a better solution
}
export interface SummaryRequestMessageData {
    subscribe?: boolean;
}
