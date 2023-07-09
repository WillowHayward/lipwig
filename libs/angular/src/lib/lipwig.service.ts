import { Injectable } from '@angular/core';

import { CreateOptions, JoinOptions, RoomQuery } from '@lipwig/model';
import { Admin, Client, Host, Lipwig, LocalClient, LocalHost } from '@lipwig/js';

// TODO: It's an edge case, but accounting for multiple hosts/clients in a single connection could be neat
@Injectable({
    providedIn: 'root',
})
export class LipwigService {
    private url?: string;
    private host?: Host;
    private admin?: Admin;
    private client?: Client;
    public connected = false;

    public setUrl(url: string) {
        this.url = url;
    }

    public async query(room: string, id?: string): Promise<RoomQuery> {
        // NOTE: This is here as well as ApiService for legacy reasons. ApiService uses the Angular HTTP Client, this uses fetch.
        if (!this.url) {
            throw new Error('Lipwig URL not set');
        }

        return Lipwig.query(this.url, room, id);
    }

    public async create(options: CreateOptions): Promise<Host> {
        if (!this.url) {
            throw new Error('Lipwig URL not set');
        }
        const promise = Lipwig.create(this.url, options);
        promise.then((host) => {
            this.host = host;
            this.connected = true;
        });
        return promise;
    }

    public async createLocal(options: CreateOptions): Promise<LocalHost> {
        const host = new LocalHost(options);
        this.host = host;
        return host;
    }

    public async join(
        code: string,
        options: JoinOptions
    ): Promise<Client> {
        if (!this.url) {
            throw new Error('Lipwig URL not set');
        }
        const promise = Lipwig.join(this.url, code, options);
        promise.then((client) => {
            this.client = client;
            this.connected = true;
        });
        return promise;
    }

    public async rejoin(
        code: string,
        id: string): Promise<Client> {
        if (!this.url) {
            throw new Error('Lipwig URL not set');
        }
        const promise = Lipwig.rejoin(this.url, code, id);
        promise.then((client) => {
            this.client = client;
            this.connected = true;
        });
        return promise;
    }

    public async joinLocal(options: JoinOptions): Promise<LocalClient> {
        if (!this.host) {
            throw new Error('Must create room before making local client');
        }
        const client = this.host.createLocalClient(options);
        this.client = client;

        return client;
    }

    public async administrate(): Promise<Admin> {
        if (!this.url) {
            throw new Error('Lipwig URL not set');
        }

        const promise = Lipwig.administrate(this.url);
        promise.then(admin => {
            this.admin = admin;
            this.connected = true;
        });

        return promise;
    }

    public getHost(): Host | undefined {
        return this.host;
    }

    public getClient(): Client | undefined {
        return this.client;
    }

    public getAdmin(): Admin | undefined {
        return this.admin;
    }
}
