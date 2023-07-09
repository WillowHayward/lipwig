/**
 * Class to initate interaction with a Lipwig server using promises
 * @author: WillHayCode
 */
//TODO: Update the string to enums from the model
import {
    ERROR_CODE,
    CreateOptions,
    JoinOptions,
    RoomQuery,
} from '@lipwig/model';
import { Host } from './host';
import { Client } from './client';
import { Admin } from './admin';

export class Lipwig {
    static async query(url: string, code: string, id?: string): Promise<RoomQuery> {
        // NOTE: This accepts a websocket url for legacy reasons
        if (url.startsWith('wss')) {
            url = url.replace('wss', 'https');
        } else if (url.startsWith('ws')) {
            url = url.replace('ws', 'http');
        }

        const query = id ? `code=${code}&id=${id}` : `code=${code}`;
        return fetch(`${url}/api/query?${query}`).then(response => response.json()).then(json => json as RoomQuery);
    }

    static create(url: string, config: CreateOptions = {}): Promise<Host> {
        return new Promise((resolve, reject) => {
            const host = new Host(url, config);
            host.on('created', () => {
                resolve(host);
            });

            host.on('host-reconnected', () => {
                resolve(host);
            });

            host.once('error', (error: ERROR_CODE, message?: string) => {
                reject({ error, message });
            });
        });
    }

    static join(
        url: string,
        code: string,
        options: JoinOptions = {}
    ): Promise<Client> {
        return new Promise((resolve, reject) => {
            const client = new Client(url, code, options);
            client.on('joined', () => {
                resolve(client);
            });

            client.once('error', (error: ERROR_CODE, message?: string) => {
                reject({ error, message });
            });
        });
    }

    static rejoin(
        url: string,
        code: string,
        id: string
    ): Promise<Client> {
        return new Promise((resolve, reject) => {
            const client = new Client(url, code, id);

            client.on('rejoined', () => {
                resolve(client);
            });

            client.once('error', (error: ERROR_CODE, message?: string) => {
                reject({ error, message });
            });
        });
    }

    static administrate(
        url: string,
    ): Promise<Admin> {
        return new Promise((resolve, reject) => {
            const admin = new Admin(url);

            admin.on('administrating', () => {
                resolve(admin);
            });

            admin.once('error', (error: ERROR_CODE, message?: string) => {
                reject({ error, message });
            });
        });
    }
}
