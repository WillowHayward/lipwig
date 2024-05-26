import { BaseServerCommonEvent } from '../common/server.common.events';
import { LipwigSummary, BaseServerAdminEvent } from './server.admin.model';

export interface BaseServerAdminMessageData {
    [BaseServerCommonEvent.ERROR]: never; // TODO
    [BaseServerAdminEvent.ADMINISTRATING]: never;
    [BaseServerAdminEvent.SUMMARY]: SummaryMessageData;
}

export interface SummaryMessageData {
    summary: LipwigSummary;
    subscribed: boolean;
}
