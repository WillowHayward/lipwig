import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { RoomSummary } from '@lipwig/model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.component.html',
    styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
    rooms: RoomSummary[] = [];

    constructor(private admin: AdminService, private router: Router) {}

    ngOnInit(): void {
        this.getRooms();
    }

    getRooms() {
        this.admin.rooms().then(rooms => {
            this.rooms = rooms;
        });
    }

    viewRoom(room: string) {
        this.router.navigate([`/room/${room}`]);
    }
}
