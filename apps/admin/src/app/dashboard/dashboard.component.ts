import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { LipwigSummary } from '@lipwig/model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    summary: LipwigSummary = {
        total: 0,
        current: 0,
        names: {}
    };
    constructor(private admin: AdminService) {}

    ngOnInit(): void {
        this.getSummary();
    }

    getSummary() {
        this.admin.summary().then(summary => {
            this.summary = summary;
        });
    }
}
