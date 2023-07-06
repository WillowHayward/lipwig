import { Component, OnInit, ViewChild } from '@angular/core';
import { LipwigService } from '@lipwig/angular';
import { HostService } from '../host.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NameInputComponent } from '../name-input/name-input.component';
import { ClientService } from '../client.service';

@Component({
    selector: 'lwc-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    @ViewChild('name') nameInput: NameInputComponent;
    code: string;

    isHost = false;
    locked = false;

    constructor(private lipwig: LipwigService, private host: HostService, private client: ClientService, private route: ActivatedRoute, private router: Router) {
        const initClient = this.lipwig.getClient();
        if (!initClient) {
            throw new Error('willow one day this will be your problem to deal with');
        }
        this.client.setClient(initClient);
    }

    ngOnInit(): void {
        const host = this.lipwig.getHost();
        const client = this.lipwig.getClient();
        if (host) {
            this.isHost = true;
            this.code = host.room;
        } else if (client) {
            this.isHost = false;
            this.code = client.room;
        } else {
            throw new Error('Invalid room - no host or client');
        }
    }

    close() {
        this.host.close('Room done now');
        this.router.navigate(['/']);
    }

    lock() {
        this.locked = true;
        this.host.lock('Keep \'em out');
    }

    unlock() {
        this.locked = false;
        this.host.unlock();
    }

    leave() {
        this.client.leave('Done here');
        this.router.navigate(['/']);
    }
}
