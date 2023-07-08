import { ConsoleLogger, Injectable } from '@nestjs/common';

// TODO: Low priority, but different colours for different groups could be nice
@Injectable()
export abstract class AbstractLogger extends ConsoleLogger {
    private room?: string;

    constructor(private group: string, protected id: string) {
        super(`${group} - ${id}`);
    }

    setRoom(room: string) {
        this.room = room;
    }

    setGroup(name: string) {
        this.group = name;
        this.setContext(`${this.group} - ${this.id}`);
    }

    setId(id: string) {
        this.id = id;
        this.setContext(`${this.group} - ${this.id}`);
    }

    private format(event: string, message?: string): string {
        let formatted: string;
        if (message) {
            formatted = `${event}: ${message}`;
        } else {
            formatted = event;
        }

        return formatted;
    }

    override log(event: string, message?: string) {
        super.log(this.format(event, message), this.context);
    }

    override debug(event: string, message?: string) {
        super.debug(this.format(event, message), this.context);
    }

    override warn(event: string, message?: string) {
        super.warn(this.format(event, message), this.context);
    }

    override error(event: string, message?: string) {
        super.error(message, this.context);
    }

}
