import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "./abstract.logger";
import { SOCKET_TYPE } from "../../common/lipwig.model";

@Injectable()
export class SocketLogger extends AbstractLogger {
    constructor(type: SOCKET_TYPE, protected override id: string) {
        super(type, id);
    }
}
