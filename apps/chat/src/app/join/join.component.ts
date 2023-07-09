import { Component, OnInit, ViewChild } from '@angular/core';
import { LipwigService, LazyLoaderService, LipwigApiService } from '@lipwig/angular';
import { NgForm } from '@angular/forms';
import { Client } from '@lipwig/js';

@Component({
    selector: 'lwc-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit {
    @ViewChild('joinForm', { static: true }) joinForm: NgForm;
    canJoin = false;
    canRejoin = false;
    roomInfo?: string;
    join = {
        name: '',
        code: ''
    }

    private id?: string;

    constructor(private lipwig: LipwigService, private api: LipwigApiService, private lazy: LazyLoaderService) {
        lazy.register('lipwig-chat', 'Lipwig Chat', () => import('@lipwig/chat/client').then(mod => mod.lipwigChatClientRoutes));
    }

    ngOnInit(): void {
        this.id = window.sessionStorage.getItem('id') || undefined;
        this.joinListener();
    }

    private joinListener() {
        this.joinForm.valueChanges?.subscribe(value => {
            if (!value.code) {
                return;
            }

            if (value.code.length === 4) {
                this.api.query(value.code, this.id).then(response => {
                    if (response.room !== value.code) {
                        // Query for another code
                        return;
                    }


                    if (!response.exists) {
                        this.roomInfo = 'Room Not Found';
                        return;
                    }

                    if (!response.name) {
                        this.roomInfo = 'Unrecognized Room Name';
                        return;
                    }

                    const appName = this.lazy.getAppName(response.name);

                    if (response.rejoin) {
                        this.roomInfo = appName;
                        this.lazy.preload(response.name);
                        this.canJoin = true;
                        this.canRejoin = true;
                        return;
                    }

                    if (response.locked) {
                        this.roomInfo = `${appName} (${response.lockReason ?? 'Cannot Join Room'})`;
                        return;
                    }

                    if (response.capacity === 0) {
                        this.roomInfo = `${appName} (Room Full)`;
                        return;
                    }

                    this.roomInfo = appName;
                    this.lazy.preload(response.name);
                    if (value.name && value.name.length > 0 && value.name.length < 13) {
                        this.canJoin = true;
                    }
                });
            } else {
                this.roomInfo = undefined;
                this.canJoin = false;
                this.canRejoin = false;
            }
        });

    }

    onJoin() {
        const code = this.join.code;

        let promise: Promise<Client>;
        if (this.canRejoin) {
            promise = this.lipwig.rejoin(code, this.id as string);
        } else {
            const name = this.join.name;
            promise = this.lipwig.join(code, {
                data: {
                    name
                }
            });
        }
        promise.then(client => {
            window.sessionStorage.setItem('id', client.id);
            this.lazy.navigate(code);
        }).catch(() => {
            alert('Could not join room');
        });
    }
}
