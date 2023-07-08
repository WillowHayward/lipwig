import { AbstractSocket } from "./AbstractSocket";
import { WebSocket } from '../app/app.model';

jest.mock('../app/app.model', () => {
    return {
        WebSocket: jest.fn().mockImplementation(() => {
            return {
                on: jest.fn(),
                send: jest.fn(),
                close: jest.fn()
            }
        })
    }
});

const mockedWebSocket = WebSocket as jest.MockedClass<typeof WebSocket>;

describe('AbstractSocket', () => {
    let ws: WebSocket;

    beforeEach(async () => {
        mockedWebSocket.mockClear();
        ws = new WebSocket('');
    });

    it('should be defined', () => {
        new AbstractSocket(ws);
        expect(ws.on).toBeCalledWith('close', expect.anything());
    });

    it('should initialize as host', () => {
        const socket = new AbstractSocket(ws);
        socket.initialize('', true, null);

        expect(ws.on).toBeCalledTimes(2);
    });

    it('should initialize as client', () => {
        const socket = new AbstractSocket(ws);
        socket.initialize('', false, null);

        expect(ws.on).toBeCalledTimes(2);
    });
});
