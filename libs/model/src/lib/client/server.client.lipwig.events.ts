import { SERVER_CLIENT_EVENT } from '../common.model';
import { EventStructure } from './structure.model';

// Server -> Client events specific to Lipwig functionality
export interface Message extends EventStructure {
    event: SERVER_CLIENT_EVENT.MESSAGE;
    data: MessageData;
}

export interface MessageData {
    event: string;
    args: unknown[];
}

export interface Poll extends EventStructure {
    event: SERVER_CLIENT_EVENT.POLL;
    data: PollData;
}

export interface PollData {
    id: string;
    query: string;
}
