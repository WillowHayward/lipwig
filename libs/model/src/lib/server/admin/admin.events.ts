import { SERVER_ADMIN_EVENT } from "./admin.model";

interface EventStructure {
    event: SERVER_ADMIN_EVENT;
}

export interface Administrating extends EventStructure {
    event: SERVER_ADMIN_EVENT.ADMINISTRATING;
}

export interface Subscribed extends EventStructure {
    event: SERVER_ADMIN_EVENT.SUBSCRIBED;
    data: SubscribedData;
}

export interface SubscribedData {
    rooms: {
        id: string;
        code: string;
    }[];
}

export interface RoomSubscribed extends EventStructure {
    event: SERVER_ADMIN_EVENT.ROOM_SUBSCRIBED;
    data: RoomSubscribedData;
}

export interface RoomSubscribedData {
    historical?: unknown; // Historical logs
}

export type Event = Administrating | Subscribed | RoomSubscribed;
export type EventData = SubscribedData | RoomSubscribedData;
