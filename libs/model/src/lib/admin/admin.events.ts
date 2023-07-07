import { ADMIN_EVENT } from "./admin.model";

interface EventStructure {
    event: ADMIN_EVENT;
}

export interface Administrate extends EventStructure {
    event: ADMIN_EVENT.ADMINISTRATE;
}

export type Events = Administrate;
