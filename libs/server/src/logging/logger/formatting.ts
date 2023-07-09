import { format } from "winston";
const { combine, timestamp, printf, colorize } = format;

const idColorizer = colorize({
    colors: {
        ROOM: 'magenta bold',
        ANON: 'grey bold',
        HOST: 'cyan bold',
        CLNT: 'yellow bold',
        ADMN: 'green bold'
    }
});

const levelColorizer = colorize({
    colors: {
        info: 'white',
        debug: 'grey'
    }
});

const formatSections = (id: string, event: string, data: string, type?: string, subevent?: string): [string, string] => {
    const fullId = `[${type} - ${id}]`;
    const fullEvent = subevent ? `${event} (${subevent})` : event;
    const fullMessage = `${fullEvent}: ${data}`;

    return [fullId, fullMessage];
}

export const formatConsole = combine(
    timestamp(),
    printf(({ timestamp, level, id, type, event, subevent, data }) => {
        if (!type) {
            type = 'ROOM';
        }
        let [fullId, fullMessage] = formatSections(id, event, data, type, subevent);
        fullId = idColorizer.colorize(type, fullId);
        fullMessage = levelColorizer.colorize(level, fullMessage);
        return `${timestamp} ${fullId} ${fullMessage}`;
    })
)

export const formatFile = combine(
    timestamp(),
    printf(({ timestamp, id, type, event, subevent, data }) => {
        if (!type) {
            type = 'ROOM';
        }
        const [fullId, fullMessage] = formatSections(id, event, data, type, subevent);
        return `${timestamp} ${fullId} ${fullMessage}`;
    })
)
