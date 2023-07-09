import { SERVER_GENERIC_EVENTS, ERROR_CODE, RoomQuery  } from './generic.model';

// Generic events dispatched by the server
interface EventStructure {
    // TODO: At this point this should just be one interface used across all event types
    // CONT: event: string;
    event: SERVER_GENERIC_EVENTS;
}

export interface Error extends EventStructure {
    event: SERVER_GENERIC_EVENTS.ERROR;
    data: ErrorData;
}

export interface ErrorData {
    error: ERROR_CODE;
    message?: string;
}

export interface QueryResponse {
    event: SERVER_GENERIC_EVENTS.QUERY_RESPONSE;
    data: RoomQuery;
}

export type Event = Error | QueryResponse;
export type EventData = ErrorData | RoomQuery;
