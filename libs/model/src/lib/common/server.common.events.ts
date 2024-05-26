import { ERROR_CODE } from './common.exports';
import { ServerCommonEvent, RoomQuery } from './server.common.model';

export interface BaseCommonMessageData {
    [ServerCommonEvent.ERROR]: ErrorMessageData;
    [ServerCommonEvent.QUERY_RESPONSE]: RoomQuery; // TODO: Is this really common? Also, mark this as deprecrated - rest parameter is better by far
}

export interface ErrorMessageData {
    error: ERROR_CODE;
    message?: string;
}
