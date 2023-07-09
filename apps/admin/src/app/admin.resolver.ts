import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AdminService } from './admin.service';
import { Admin } from '@lipwig/js';

export const adminResolver: ResolveFn<Admin> = (route, state) => {
    const service = inject(AdminService);
    const admin = service.getAdmin();
    if (admin) {
        return admin;
    }
    return service.init();
};
