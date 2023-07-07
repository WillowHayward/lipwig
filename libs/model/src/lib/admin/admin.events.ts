import { ADMIN_EVENT } from "./admin.model";

interface EventStructure {
    event: ADMIN_EVENT;
}

export interface Administrate extends EventStructure {
    event: ADMIN_EVENT.ADMINISTRATE;
    // TODO: Authentication
}

export interface Subscribe extends EventStructure {
    event: ADMIN_EVENT.SUBSCRIBE
    data: SubscribeData;
}

export interface SubscribeData {
    existing?: boolean;
}

export interface Unsubscribe extends EventStructure {
    event: ADMIN_EVENT.UNSUBSCRIBE;
}

export interface SubscribeRoom extends EventStructure {
    event: ADMIN_EVENT.SUBSCRIBE_ROOM;
    data: SubscribeRoomData;
}

export interface SubscribeRoomData {
    id: string;
    historical?: boolean;
}

export interface UnsubscribeRoom extends EventStructure {
    event: ADMIN_EVENT.UNSUBSCRIBE_ROOM;
    data: UnsubscribeRoomData;
}

export interface UnsubscribeRoomData {
    id: string;
}

export type Event = Administrate | Subscribe | Unsubscribe | SubscribeRoom | UnsubscribeRoom;
export type EventData = SubscribeData | SubscribeRoomData | UnsubscribeRoomData;
