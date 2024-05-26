import { ERROR_CODE } from './common.exports';
import { ServerCommonEvent, RoomQuery } from './server.common.model';

export const ERROR_EVENT = 'error';
export enum BaseServerCommonEvent {
    ERROR = ERROR_EVENT,
}

export interface BaseCommonServerMessageData {
    [BaseServerCommonEvent.ERROR]: ErrorMessageData;
    [ServerCommonEvent.QUERY_RESPONSE]: RoomQuery; // TODO: Is this really common? Also, mark this as deprecrated - rest parameter is better by far
}

export interface ErrorMessageData {
    error: ERROR_CODE;
    message?: string;
}
