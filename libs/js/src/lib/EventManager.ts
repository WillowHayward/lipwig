import { EventEmitter } from 'events';

export class EventManager {
    private events = new EventEmitter();

    on(eventName: string, listener: (...args: any[]) => void): void {
        this.events.on(eventName, listener);
    }

    once(eventName: string, listener: (...args: any[]) => void): void {
        this.events.once(eventName, listener);
    }

    emit(eventName: string, ...args: any[]): boolean {
        return this.events.emit(eventName, ...args);
    }
}
