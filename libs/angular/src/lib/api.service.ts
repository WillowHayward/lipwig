import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LipwigSummary, RoomQuery, RoomSummary } from '@lipwig/model';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LipwigApiService {
    private url?: string;

    constructor(private http: HttpClient) { }

    public setUrl(url: string) {
        this.url = url;
    }

    public async query(code: string, id?: string): Promise<RoomQuery> {
        return this.getRequest<RoomQuery>('query', { code, id });
    }

    public async adminSummary(): Promise<LipwigSummary> {
        return this.getRequest<LipwigSummary>('admin/summary');
    }

    public async adminRooms(): Promise<RoomSummary[]> {
        return this.getRequest<RoomSummary[]>('admin/rooms');
    }

    public async adminRoom(id: string): Promise<RoomSummary> {
        return this.getRequest<RoomSummary>(`admin/room/${id}`);
    }

    private getRequest<T>(endpoint: string, params?: Record<string, string | undefined>): Promise<T> {
        if (!this.url) {
            throw new Error('Lipwig API URL not set');
        }

        let query = '';
        if (params) {
            const queryParams = new URLSearchParams();

            for (const param in params) {
                const value = params[param];
                if (value === undefined) {
                    continue;
                }

                queryParams.set(param, value);
            }

            query = '?' + queryParams.toString();
        }

        const url = `${this.url}/api/${endpoint}${query}`;

        return firstValueFrom(this.http.get<T>(url));
    }
}
