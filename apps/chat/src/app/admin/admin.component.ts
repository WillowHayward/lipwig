import { Component, OnInit } from '@angular/core';
import { LipwigService } from '@lipwig/angular';

@Component({
    selector: 'lwc-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
    constructor(private lipwig: LipwigService) {}

    ngOnInit(): void {
        this.lipwig.administrate().then(admin => {
            console.log('Administrating', admin);
        });
    }
}
