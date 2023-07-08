import { SocketLogger } from "./socket.logger";
import { RoomLogger } from "./room.logger";

// NOTE: For use in room instances
export class Loggers {
    static socketLogger: SocketLogger;
    static roomLogger: RoomLogger;

    static setSocketLogger(logger: SocketLogger) {
        Loggers.socketLogger = logger;
    }

    static setRoomLogger(logger: RoomLogger) {
        Loggers.roomLogger = logger;
    }

    static getSocketLogger(): SocketLogger {
        return Loggers.socketLogger;
    }

    static getRoomLogger(): RoomLogger {
        return Loggers.roomLogger;
    }
}
