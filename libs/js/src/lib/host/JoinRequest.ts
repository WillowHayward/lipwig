import { HOST_EVENT } from '@lipwig/model';
import { Host } from './Host';

export class JoinRequest {
    constructor(private host: Host, private id: string) {}

    public approve(): void {
        this.sendJoinResponse(true);
    }

    public reject(reason?: string): void {
        this.sendJoinResponse(false, reason);
    }

    private sendJoinResponse(response: boolean, reason?: string): void {
        this.host.send({
            event: HOST_EVENT.JOIN_RESPONSE,
            data: {
                id: this.id,
                response,
                reason,
            },
        });
    }
}
