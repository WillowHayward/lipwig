import {
    ERROR_CODE,
    CreateOptions,
    JoinOptions,
    RoomQuery,
} from '@lipwig/model';
import { Host } from './host';
import { Client } from './client';
import { Admin } from './admin';

async function fetchRoomQuery(url: string, code: string, id?: string): Promise<RoomQuery> {
    url = url.replace(/^ws(s)?/, 'http$1');
    const query = id ? `code=${code}&id=${id}` : `code=${code}`;
    const response = await fetch(`${url}/api/query?${query}`);
    const json = await response.json();
    return json as RoomQuery;
}

// TODO: Determine better way to handle this any any[]
function createInstance<T extends Host | Client | Admin>(InstanceType: new(...args: any[]) => T, resolveEvent: string, ...args: unknown[]): Promise<T> {
    return new Promise((resolve, reject) => {
        const instance = new InstanceType(...args);
        instance.on(resolveEvent, () => resolve(instance));
        instance.once('error', (error: ERROR_CODE, message?: string) => reject({ error, message }));
    });
}

export class Lipwig {
    static query = fetchRoomQuery;

    static create(url: string, config: CreateOptions = {}): Promise<Host> {
        return createInstance(Host, 'created', url, config);
    }

    static join(url: string, code: string, options: JoinOptions = {}): Promise<Client> {
        return createInstance(Client, 'joined', url, code, options);
    }

    static rejoin(url: string, code: string, id: string): Promise<Client> {
        return createInstance(Client, 'rejoined', url, code, id);
    }

    static administrate(url: string): Promise<Admin> {
        return createInstance(Admin, 'administrating', url);
    }
}
