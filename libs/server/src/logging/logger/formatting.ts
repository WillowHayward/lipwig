import { format } from "winston";
const { combine, timestamp, printf, colorize } = format;

const idColorizer = colorize({
    colors: {
        Room: 'magenta bold',
        Anonymous: 'grey bold',
        Host: 'cyan bold',
        Client: 'yellow bold',
        Admin: 'green bold'
    }
});

const levelColorizer = colorize({
    colors: {
        info: 'white',
        debug: 'grey'
    }
});

//timestamp [Type - id] event (subevent): message
export const formatRoomLog = combine(
    timestamp(),
    printf(({ timestamp, level, roomId, event, subevent, message }) => {
        const fullId = idColorizer.colorize('Room', `[Room - ${roomId}]`);
        const fullEvent = subevent ? `${event} (${subevent})` : event;
        const fullMessage = levelColorizer.colorize(level, `${fullEvent}: ${message}`);
        return `${timestamp} ${fullId} ${fullMessage}`;
    })
);

export const formatSocketLog = combine(
    timestamp(),
    printf(({ timestamp, level, type, socketId, event, subevent, message }) => {
        const fullId = idColorizer.colorize(type, `[${type} - ${socketId}]`);
        const fullEvent = subevent ? `${event} (${subevent})` : event;
        const fullMessage = levelColorizer.colorize(level, `${fullEvent}: ${message}`);
        return `${timestamp} ${fullId} ${fullMessage}`;
    })
);
