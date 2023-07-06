import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { LipwigChatCommonModule, RoomComponent } from '@lipwig/chat/common';

import { AppComponent } from './app.component';
import { CreateComponent } from './create/create.component';
import { LocalComponent } from './local/local.component';
import { JoinComponent } from './join/join.component';

const routes: Routes = [
    {
        path: '',
        component: CreateComponent,
    },
    {
        path: 'local',
        component: LocalComponent,
    },
    {
        path: 'join',
        component: JoinComponent,
    },
    {
        path: ':code',
        component: RoomComponent
    }
];

@NgModule({
    declarations: [AppComponent, CreateComponent, LocalComponent, JoinComponent],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        LipwigChatCommonModule,
        RouterModule.forRoot(routes),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}