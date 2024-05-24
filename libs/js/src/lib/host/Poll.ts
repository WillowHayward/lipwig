import { v4 } from 'uuid';
import { Host } from './Host';
import { HOST_EVENT } from '@lipwig/model';
import { EventManager } from '../EventManager';
import { User } from './User';

export class Poll extends EventManager {
    constructor(
        private host: Host,
        users: User[],
        public query: string,
        public id: string = v4()
    ) {
        super();
        this.sendPoll(users);
    }

    private sendPoll(users: User[]): void {
        this.host.send({
            event: HOST_EVENT.POLL,
            data: {
                id: this.id,
                recipients: users.map((user) => user.id),
                query: this.query,
            },
        });
    }
}
