import { Injectable } from '@angular/core';
import { LipwigApiService, LipwigService } from '@lipwig/angular';
import { Admin } from '@lipwig/js';
import { LipwigSummary, RoomSummary } from '@lipwig/model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private admin?: Admin;

    constructor(private lipwig: LipwigService, private api: LipwigApiService) {}

    init(): Promise<Admin> {
        this.lipwig.setUrl('ws://localhost:8989');
        this.api.setUrl('http://localhost:8989');
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
        return this.api.adminSummary();
    }

    async rooms(): Promise<RoomSummary[]> {
        return this.api.adminRooms();
    }

    async room(id: string): Promise<RoomSummary> {
        return this.api.adminRoom(id);
    }
}
