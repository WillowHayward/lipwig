import { SERVER_CLIENT_EVENT, SERVER_HOST_EVENT } from '@lipwig/model';
import { AbstractSocket, LipwigSocket } from '../../socket';
import { Room } from './room.instance';
jest.mock('./AbstractSocket');
jest.mock('../app/app.model', () => {
    return {
        LipwigSocket: jest.fn().mockImplementation(() => {
            return {
                on: jest.fn(),
                send: jest.fn(),
                close: jest.fn(),
            };
        }),
    };
});

const mockedAbstractSocket = AbstractSocket as jest.MockedClass<
    typeof AbstractSocket
>;

describe('Room', () => {
    let socket: LipwigSocket;
    let host: AbstractSocket;
    beforeEach(async () => {
        mockedAbstractSocket.mockClear();
        socket = new LipwigSocket('');
        host = new AbstractSocket(socket);
        host.id = 'HOSTID';
    });

    it('should alert host on creation', () => {
        new Room(host, 'ROOMCODE', {});

        expect(host.send).toBeCalledWith({
            event: SERVER_HOST_EVENT.CREATED,
            data: {
                code: 'ROOMCODE',
                id: 'HOSTID',
            },
        });
    });

    it('should alert host and client on joining', () => {
        const room = new Room(host, 'ROOMCODE', {});
        const client = new AbstractSocket(socket);
        client.id = 'CLIENTID';

        room.join(client, {});

        expect(host.send).toBeCalledWith({
            event: SERVER_HOST_EVENT.JOINED,
            data: {
                id: 'CLIENTID',
                options: {},
            },
        });

        expect(client.send).toBeCalledWith({
            event: SERVER_CLIENT_EVENT.JOINED,
            data: {
                id: 'CLIENTID',
            },
        });
    });

    /* TODO: Figure out testing event listeners w/ jest
        * it ('should alert host on client disconnection', () => {
        const room = new Room(host, 'ROOMCODE', {});
        const client = new AbstractSocket(socket);
        client.id = 'CLIENTID';

        room.join(client, {});
        client.emit('disconnect');

        expect(host.send).toHaveBeenLastCalledWith({
            event: SERVER_HOST_EVENT.CLIENT_DISCONNECTED,
            data: {
                id: 'CLIENTID'
            }
        });

    });*/
});
