import { Component } from '@angular/core';
import { LipwigApiService, LipwigService } from '@lipwig/angular';

@Component({
    selector: 'lwc-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'lipwig-chat';

    constructor(lipwig: LipwigService, api: LipwigApiService) {
        lipwig.setUrl('ws://localhost:8989');
        api.setUrl('http://localhost:8989');
    }
}
