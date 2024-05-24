import { AnonymousSocket, ClientSocket, } from "../../socket";
import { HostError, JoinError, RejoinError } from "../errors";
import { JoinOptions, BaseHostErrorCode, BaseJoinErrorCode, BaseRejoinErrorCode } from "@lipwig/model";

export interface Pending {
    socket: AnonymousSocket;
    options: JoinOptions;
}

// TODO: SocketManager instead?
export class ClientManager {
    private pending: Map<string, Pending> = new Map();
    private clients: Map<string, ClientSocket> = new Map();
    private localClients: Set<string> = new Set();

    // Clients that are not yet fully connected
    addPending(tempId: string, socket: AnonymousSocket, options: JoinOptions) {
        // TODO: Check tempId for collisions?
        this.pending.set(tempId, { socket, options });
    }


    findAndRemovePendingOrThrow(tempId: string): Pending {
        const pending = this.pending.get(tempId);
        if (!pending) {
            // TODO: Determine best format for this kind of error. Does the additional text help? It might in js, but probably not here
            throw new HostError(BaseHostErrorCode.USERNOTFOUND, `Pending client with id ${tempId} not found`);
        }
        this.pending.delete(tempId);
        return pending;
    }

    addClient(client: ClientSocket) {
        // TODO: Errors, reconnection
        if (this.clients.has(client.id)) {
            throw new JoinError(BaseJoinErrorCode.ALREADYCONNECTED, `Client with id ${client.id} already exists`);
        }
        this.clients.set(client.id, client);
    }

    removeClient(client: ClientSocket) {
        // TODO: Errors
        this.clients.delete(client.id);
    }

    // Replace existing client
    setClient(client: ClientSocket) {
        if (!this.clients.has(client.id)) {
            throw new RejoinError(BaseRejoinErrorCode.USERNOTFOUND, `Client with id ${client.id} not found`);
        }
        this.clients.set(client.id, client);
    }

    // TODO: Consider getter
    getClients(): Set<ClientSocket> {
        return new Set(this.clients.values());
    }

    getClientIds(): string[] {
        return Array.from(this.clients.keys());
    }

    clientExists(id: string): boolean {
        return this.clients.has(id);
    }

    findClient(id: string): ClientSocket | undefined {
        return this.clients.get(id);
    }

    findClientOrThrow(id: string): ClientSocket {
        const client = this.findClient(id);
        if (!client) {
            throw new HostError(BaseHostErrorCode.USERNOTFOUND, `Client with id ${id} not found`);
        }

        return client;
    }

    findClientsAndMissing(ids: string[]): [ClientSocket[], string[]] {
        const clients = ids.filter((id) => this.clients.has(id)).map((id) => this.findClient(id) as ClientSocket);
        const missing = ids.filter((id) => !this.clients.has(id));

        return [clients, missing];
    }

    addLocalClient(id: string) {
        if (this.localClients.has(id)) {
            throw new HostError(BaseHostErrorCode.LOCALUSEREXISTS, `Local client with id ${id} already exists`);
        }

        this.localClients.add(id);
    }

    removeLocalClient(id: string) {
        if (!this.localClients.has(id)) {
            throw new HostError(BaseHostErrorCode.LOCALUSERNOTFOUND, `Local client with id ${id} does not exist`);
        }

        this.localClients.delete(id);
    }

    getLocalClientIds(): string[] {
        return Array.from(this.localClients);
    }

    get clientCount(): number {
        // TODO: Parameter for local clients?
        return this.clients.size + this.localClients.size;
    }
}
