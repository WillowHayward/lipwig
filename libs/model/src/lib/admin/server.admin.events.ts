import { BaseServerCommonEvent } from '../common/server.common.events';
import { LipwigSummary, BaseServerAdminEvent } from './server.admin.model';
import { ERROR_EVENT, ErrorMessageData, MESSAGE_EVENT } from '../common';
import { AdminError } from './admin.errors';

// All server -> admin events. Should match keys of ServerAdminMessageData
export const ServerAdminEvent = {
    ERROR: BaseServerCommonEvent.ERROR,
    ADMINISTRATING: BaseServerAdminEvent.ADMINISTRATING,
    SUMMARY: BaseServerAdminEvent.SUMMARY
} as const;

export interface ServerAdminEventData {
    [ERROR_EVENT]: ErrorMessageData<typeof AdminError>; // TODO
    [BaseServerAdminEvent.ADMINISTRATING]: never;
    [BaseServerAdminEvent.SUMMARY]: SummaryMessageData;
    [MESSAGE_EVENT]: never; // TODO: Currently including for completeness, determine a better solution
}

export interface SummaryMessageData {
    summary: LipwigSummary;
    subscribed: boolean;
}
