import { BaseAdminEvent } from './admin.model';
import { BaseServerAdminEvent } from './server.admin.model';

export { BaseAdminMessageData as AdminMessageData } from './admin.events';
export { BaseServerAdminMessageData as ServerAdminMessageData } from './server.admin.events';
// All admin -> server events. Should match keys of AdminMessageData
export enum AdminEvent {
    ADMINISTRATE = BaseAdminEvent.ADMINISTRATE,
    SUMMARY_REQUEST = BaseAdminEvent.SUMMARY_REQUEST,
    SUMMARY_UNSUBSCRIBE = BaseAdminEvent.SUMMARY_UNSUBSCRIBE,
}

// All server -> admin events. Should match keys of ServerAdminMessageData
export enum ServerAdminEvent {
    ADMINISTRATING = BaseServerAdminEvent.ADMINISTRATING,
    SUMMARY = BaseServerAdminEvent.SUMMARY
}
