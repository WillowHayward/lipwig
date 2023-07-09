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
        const host = location.host; // TODO: This does not account for lipwig being hosted on a subpath
        const protocol = location.protocol;
        const wsProtocol = protocol.replace('http', 'ws');

        this.lipwig.setUrl(`${wsProtocol}//${host}`);
        this.api.setUrl(`${protocol}//${host}`);
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
