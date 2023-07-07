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
        total: -1
    };
    constructor(private admin: AdminService) {}

    ngOnInit(): void {
        this.admin.summary().then(summary => {
            this.summary = summary;
        });
    }
}
