import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './room/room.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'rooms',
        component: RoomsComponent
    },
    {
        path: 'room/:id',
        component: RoomComponent
    }
];
