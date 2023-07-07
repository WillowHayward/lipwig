import { SERVER_ADMIN_EVENT } from "./admin.model";

interface EventStructure {
    event: SERVER_ADMIN_EVENT;
}

export interface Administrating extends EventStructure {
    event: SERVER_ADMIN_EVENT.ADMINISTRATING;
}

export type Event = Administrating;
