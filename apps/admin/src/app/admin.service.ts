import { Injectable } from '@angular/core';
import { LipwigService } from '@lipwig/angular';
import { Admin } from '@lipwig/js';
import { LipwigSummary } from '@lipwig/model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private admin?: Admin;

    constructor(private lipwig: LipwigService) {}

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

    async summary(subscribe = false): Promise<LipwigSummary> {
        return new Promise(resolve => {
            if (!this.admin) {
                throw new Error('Admin not initialized');
            }

            this.admin.once('summary', (summary: LipwigSummary) => {
                resolve(summary);
            });

            this.admin.summary(subscribe);
        });
    }

}
