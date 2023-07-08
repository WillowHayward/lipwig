import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LipwigService } from '@lipwig/angular';
import { Admin } from '@lipwig/js';
import { LipwigSummary } from '@lipwig/model';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private admin?: Admin;

    constructor(private lipwig: LipwigService, private http: HttpClient) {}

    init(): Promise<Admin> {
        this.lipwig.setUrl('ws://localhost:8989');
        const promise = this.lipwig.administrate();
        promise.then(admin => {
            this.admin = admin;
        });

        return promise;
    }

    getAdmin(): Admin | undefined {
        return this.admin;
    }

    async summary(): Promise<LipwigSummary> {
        return firstValueFrom(this.http.get<LipwigSummary>('http://localhost:8989/admin/summary'));
    }

}
