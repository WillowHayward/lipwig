import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LipwigLogger extends ConsoleLogger {
    private room?: string;
    constructor(private name: string, private id: string) {
        super(`${name} - ${id}`);
    }

    setRoom(room: string) {
        this.room = room;
    }

    setName(name: string) {
        this.name = name;
        this.setContext(`${this.name} - ${this.id}`);
    }

    setId(id: string) {
        this.id = id;
        this.setContext(`${this.name} - ${this.id}`);
    }

    override log(message: string) {
        super.log(message, this.context);
    }

    override debug(message: string) {
        super.debug(message, this.context);
    }

    override warn(message: string) {
        super.warn(message, this.context);
    }

    override error(message: string) {
        super.error(message, this.context);
    }

}
