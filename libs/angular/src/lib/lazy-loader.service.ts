import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LazyLoaderService {

    private apps: Record<string, {
        routes: () => Promise<Route[]>;
        name: string;
    }> = {
        }

    private routes?: Promise<Route[]>;

    constructor(private router: Router) { }

    getAppName(key: string): string {
        if (!this.apps[key]) {
            throw new Error(`Application '${key}' not recognized`);
        }

        return this.apps[key].name;
    }

    public register(key: string, name: string, routes: () => Promise<Route[]>) {
        this.apps[key] = {
            routes,
            name
        }
    }

    async preload(key: string) {
        if (!this.apps[key]) {
            throw new Error(`Application '${key}' not recognized`);
        }

        const callback = this.apps[key].routes;
        this.routes = callback();
        this.routes.then(routes => {
            const config = this.router.config;
            let route = config.find(route => route.path === ':code');

            if (!route) {
                route = {
                    path: ':code',
                }
                config.push(route);
            }

            route.children = routes;
            this.router.resetConfig(config);
        });
    }

    async navigate(code: string, skipLocationChange = true): Promise<void> {
        if (!this.routes) {
            throw new Error('No routes loaded');
        }
        this.routes.then(() => {
            this.router.navigate([code], { skipLocationChange });
        });
    }
}
