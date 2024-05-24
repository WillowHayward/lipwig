import { BasePollErrorCode } from "@lipwig/model";
import { ClientSocket } from "../../socket";
import { PollError } from ".././errors";

export class Poll {
    open = true;
    pending: Set<ClientSocket>;
    received: Set<ClientSocket> = new Set();

    constructor(public id: string, recipients: ClientSocket[]) {
        this.pending = new Set(recipients);
    }

    markResponded(client: ClientSocket): void {
        // TODO: Change each client.error to throw an error, catch and handle higher up (but still exit pollResponse on failure)
        if (this.received.has(client)) {
            throw new PollError(BasePollErrorCode.POLLALREADYRESPONSED, `Client ${client.id} has already responded to poll ${this.id}`);
        }

        if (!this.pending.has(client)) {
            throw new PollError(BasePollErrorCode.POLLUSERNOTFOUND, `User not found in poll ${this.id}`);
        }

        if (!this.open) {
            throw new PollError(BasePollErrorCode.POLLCLOSED, `Poll ${this.id} is closed`);
        }
        this.received.add(client);
        this.pending.delete(client);

        if (this.pending.size === 0) {
            this.open = false;
        }
    }
}
