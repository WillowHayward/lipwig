import { BasePollErrorCode } from "@lipwig/model";
import { ClientSocket } from "../../socket";
import { PollError } from "../errors";
import { Poll } from "./poll";


export class PollManager {
    private polls: Map<string, Poll> = new Map();

    createPoll(id: string, recipients: ClientSocket[]): Poll {
        const poll = new Poll(id, recipients);
        if (this.polls.has(poll.id)) {
            throw new PollError(BasePollErrorCode.POLLALREADYEXISTS, `Poll with id ${id} already exists`);
        }
        this.polls.set(poll.id, poll);
        return poll;
    }

    findPollOrThrow(id: string): Poll {
        const poll = this.polls.get(id);
        if (!poll) {
            throw new PollError(BasePollErrorCode.POLLNOTFOUND, `Poll with id ${id} not found`);
        }

        return poll;
    }
}
