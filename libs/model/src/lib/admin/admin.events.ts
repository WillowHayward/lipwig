import { ADMIN_EVENTS } from "./admin.model";

interface EventStructure {
    event: ADMIN_EVENTS;
}

export interface Administrate extends EventStructure {
    event: ADMIN_EVENTS.ADMINISTRATE;
}

export type Events = Administrate;
