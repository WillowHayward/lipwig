import { ClientManager } from './client.manager';
import { AnonymousSocket, ClientSocket } from "../../socket";
import { JoinOptions } from "@lipwig/model";

describe('ClientManager', () => {
    let clientManager: ClientManager;
    let mockSocket: AnonymousSocket;
    let mockClientSocket: ClientSocket;
    let mockJoinOptions: JoinOptions;

    beforeEach(() => {
        clientManager = new ClientManager();
        mockSocket = {} as AnonymousSocket;
        mockClientSocket = { id: 'testId' } as ClientSocket;
        mockJoinOptions = {} as JoinOptions;
    });

    it('should add pending client', () => {
        clientManager.addPending('tempId', mockSocket, mockJoinOptions);
        expect(() => clientManager.findAndRemovePendingOrThrow('tempId')).not.toThrow();
    });

    it('should throw error when removing non-existing pending client', () => {
        expect(() => clientManager.findAndRemovePendingOrThrow('tempId')).toThrow();
    });

    it('should add client', () => {
        clientManager.addClient(mockClientSocket);
        expect(clientManager.clientExists('testId')).toBe(true);
    });

    it('should throw error when adding existing client', () => {
        clientManager.addClient(mockClientSocket);
        expect(() => clientManager.addClient(mockClientSocket)).toThrow();
    });

    it('should remove client', () => {
        clientManager.addClient(mockClientSocket);
        clientManager.removeClient(mockClientSocket);
        expect(clientManager.clientExists('testId')).toBe(false);
    });

    it('should replace existing client', () => {
        clientManager.addClient(mockClientSocket);
        const newClientSocket = { id: 'testId' } as ClientSocket;
        clientManager.setClient(newClientSocket);
        expect(clientManager.findClient('testId')).toBe(newClientSocket);
    });

    it('should throw error when replacing non-existing client', () => {
        const newClientSocket = { id: 'testId' } as ClientSocket;
        expect(() => clientManager.setClient(newClientSocket)).toThrow();
    });
});
