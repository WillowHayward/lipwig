import { format } from "winston";
const { combine, timestamp, printf, colorize } = format;

const idColorizer = colorize({
    colors: {
        ROOM: 'magenta bold',
        ANON: 'grey bold',
        HOST: 'cyan bold',
        CLNT: 'yellow bold',
        ADMN: 'green bold',
        API: 'blue bold',
    }
});

const levelColorizer = colorize({
    colors: {
        info: 'white',
        debug: 'grey'
    }
});

const formatSections = (event: string, type: string, id?: string, data?: string, subevent?: string): [string, string] => {
    const fullId = id ? `[${type} - ${id}]` : `[${type}]`;
    const fullEvent = subevent ? `${event} (${subevent})` : event;
    const fullMessage = data ? `${fullEvent}: ${data}` : fullEvent;

    return [fullId, fullMessage];
}

export const formatConsole = combine(
    timestamp(),
    printf(({ timestamp, level, id, type, event, subevent, data }) => {
        let [fullId, fullMessage] = formatSections(event, type, id, data, subevent);
        fullId = idColorizer.colorize(type, fullId);
        fullMessage = levelColorizer.colorize(level, fullMessage);
        return `${timestamp} ${fullId} ${fullMessage}`;
    })
)

export const formatFile = combine(
    timestamp(),
    printf(({ timestamp, id, type, event, subevent, data }) => {
        const [fullId, fullMessage] = formatSections(event, type, id, data, subevent);
        return `${timestamp} ${fullId} ${fullMessage}`;
    })
)
