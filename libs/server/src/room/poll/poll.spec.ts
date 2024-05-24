import { Poll } from './poll';
import { BasePollErrorCode } from "@lipwig/model";
import { ClientSocket } from "../../socket";
import { PollError } from ".././errors";

jest.mock("@lipwig/model");
jest.mock("../../socket");
jest.mock(".././errors");

describe('Poll', () => {
    let poll: Poll;
    let mockSocket1: jest.Mocked<ClientSocket>;
    let mockSocket2: jest.Mocked<ClientSocket>;

    beforeEach(() => {
        mockSocket1 = new ClientSocket() as jest.Mocked<ClientSocket>;
        mockSocket1.id = '1';
        mockSocket2 = new ClientSocket() as jest.Mocked<ClientSocket>;
        mockSocket2.id = '2';
        poll = new Poll('test-poll', [mockSocket1, mockSocket2]);
    });

    it('should mark a client as responded', () => {
        poll.markResponded(mockSocket1);
        expect(poll.pending.has(mockSocket1)).toBe(false);
        expect(poll.received.has(mockSocket1)).toBe(true);
    });

    it('should throw an error if a client tries to respond twice', () => {
        poll.markResponded(mockSocket1);
        expect(() => poll.markResponded(mockSocket1)).toThrow(PollError);
        expect(() => poll.markResponded(mockSocket1)).toThrowError(new PollError(BasePollErrorCode.POLLALREADYRESPONSED, `Client ${mockSocket1.id} has already responded to poll ${poll.id}`));
    });

    it('should throw an error if a non-recipient tries to respond', () => {
        const mockSocket3 = new ClientSocket() as jest.Mocked<ClientSocket>;
        mockSocket3.id = '3';
        expect(() => poll.markResponded(mockSocket3)).toThrow(PollError);
        expect(() => poll.markResponded(mockSocket3)).toThrowError(new PollError(BasePollErrorCode.POLLUSERNOTFOUND, `User not found in poll ${poll.id}`));
    });

    it('should close the poll when all recipients have responded', () => {
        poll.markResponded(mockSocket1);
        poll.markResponded(mockSocket2);
        expect(poll.open).toBe(false);
    });

    it('should throw an error if a client tries to respond to a closed poll', () => {
        poll.markResponded(mockSocket1);
        poll.markResponded(mockSocket2);
        expect(() => poll.markResponded(mockSocket1)).toThrow(PollError);
        expect(() => poll.markResponded(mockSocket1)).toThrowError(new PollError(BasePollErrorCode.POLLCLOSED, `Poll ${poll.id} is closed`));
    });
});
