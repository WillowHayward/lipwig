import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HostService, NameInputComponent } from '@lipwig/chat/common';

@Component({
    selector: 'lwc-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    @ViewChild('name') nameInput: NameInputComponent;

    constructor(private host: HostService, private router: Router) {}

    create(): void {
        const name = this.nameInput.name;
        this.host.connect(name).then(client => {
            this.router.navigate([client.room], { skipLocationChange: true });
        });
    }
}
