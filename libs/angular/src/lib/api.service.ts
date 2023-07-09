import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoomQuery } from '@lipwig/model';
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

    private getRequest<T>(endpoint: string, params: Record<string, string | undefined>): Promise<T> {
        if (!this.url) {
            throw new Error('Lipwig API URL not set');
        }

        const queryParams = new URLSearchParams();

        for (const param in params) {
            const value = params[param];
            if (value === undefined) {
                continue;
            }

            queryParams.set(param, value);
        }

        const url = `${this.url}/api/${endpoint}?${queryParams.toString()}`;

        return firstValueFrom(this.http.get<T>(url));
    }
}
