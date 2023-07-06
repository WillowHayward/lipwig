import { Component } from '@angular/core';
import { LipwigService } from '@lipwig/angular';

@Component({
    selector: 'lwc-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'lipwig-chat';

    constructor(lipwig: LipwigService) {
        lipwig.setUrl('ws://localhost:8989');
    }
}
