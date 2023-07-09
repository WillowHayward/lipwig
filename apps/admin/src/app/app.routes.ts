import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './room/room.component';
import { adminResolver } from './admin.resolver';

export const appRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent,
        resolve: {
            admin: adminResolver
        }
    },
    {
        path: 'rooms',
        component: RoomsComponent,
        resolve: {
            admin: adminResolver
        }
    },
    {
        path: 'room/:id',
        component: RoomComponent,
        resolve: {
            admin: adminResolver
        }
    }
];
