import { Room } from './room.instance';
import { AnonymousSocket, HostSocket, ClientSocket } from '../socket';
import { CreateOptions } from '@lipwig/model';
import { Repository } from 'typeorm';
import { RoomEntity } from '../data/entities/room.entity';
import { LipwigLogger } from '../logging/logger/lipwig.logger';

describe('Room', () => {
    let room: Room;
    let mockSocket: AnonymousSocket;
    let mockHostSocket: HostSocket;
    let mockClientSocket: ClientSocket;
    let mockCreateOptions: CreateOptions;
    let mockRepository: Repository<RoomEntity>;
    let mockLogger: LipwigLogger;

    beforeEach(() => {
        mockSocket = {} as AnonymousSocket;
        mockHostSocket = { id: 'hostId' } as HostSocket;
        mockClientSocket = { id: 'clientId' } as ClientSocket;
        mockCreateOptions = {} as CreateOptions;
        mockRepository = {} as Repository<RoomEntity>;
        mockLogger = {} as LipwigLogger;
        room = new Room(mockSocket, 'testCode', mockCreateOptions, mockRepository, mockLogger);
    });

    it('should initialize room', () => {
        expect(room.code).toBe('testCode');
    });

    it('should check if user is in room', () => {
        expect(room.inRoom('hostId')).toBe(true);
        expect(room.inRoom('clientId')).toBe(false);
    });

    it('should check if user is host', () => {
        expect(room.isHost('hostId')).toBe(true);
        expect(room.isHost('clientId')).toBe(false);
    });
});
