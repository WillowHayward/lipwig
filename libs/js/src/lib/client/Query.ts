import { Client } from "./Client";

// TODO: You seriously doubling up on "query" here, broseph? siseph?
export class Query {
    constructor(private client: Client, private id: string) { }

    public respond(response: any) {
        this.client.respondToPoll(this.id, response);
    }
}
