import { JoinOptions } from "@lipwig/model";
import { AnonymousSocket } from "../socket";


export interface Poll {
    id: string;
    pending: string[];
    received: string[];
    open: boolean;
}

// TODO: CHange to Map
export type Pending = Record<string, {
        client: AnonymousSocket;
        options: JoinOptions;
    }>;

