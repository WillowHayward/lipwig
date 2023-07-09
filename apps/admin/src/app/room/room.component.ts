import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomSummary } from '@lipwig/model';
import { AdminService } from '../admin.service';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {

    summary: RoomSummary = {
        id: '',
        name: '',
        active: false
    }

    constructor(private admin: AdminService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id') || '';
        this.getRoom(id);
    }

    getRoom(id: string) {
        this.admin.room(id).then(summary => {
            this.summary = summary;
        });
    }

}
