import { PollManager } from './poll.manager';
import { BasePollErrorCode } from "@lipwig/model";
import { ClientSocket } from "../../socket";
import { PollError } from "../errors";
import { Poll } from "./poll";

jest.mock("@lipwig/model");
jest.mock("../../socket");
jest.mock("../errors");
jest.mock("./poll");

describe('PollManager', () => {
    let pollManager: PollManager;
    let mockSocket1: jest.Mocked<ClientSocket>;
    let mockSocket2: jest.Mocked<ClientSocket>;

    beforeEach(() => {
        mockSocket1 = new ClientSocket() as jest.Mocked<ClientSocket>;
        mockSocket1.id = '1';
        mockSocket2 = new ClientSocket() as jest.Mocked<ClientSocket>;
        mockSocket2.id = '2';
        pollManager = new PollManager();
    });

    it('should create a new poll', () => {
        const poll = pollManager.createPoll('test-poll', [mockSocket1, mockSocket2]);
        expect(poll).toBeInstanceOf(Poll);
        expect(pollManager.findPollOrThrow('test-poll')).toBe(poll);
    });

    it('should throw an error if a poll with the same id already exists', () => {
        pollManager.createPoll('test-poll', [mockSocket1, mockSocket2]);
        expect(() => pollManager.createPoll('test-poll', [mockSocket1, mockSocket2])).toThrow(PollError);
        expect(() => pollManager.createPoll('test-poll', [mockSocket1, mockSocket2])).toThrowError(new PollError(BasePollErrorCode.POLLALREADYEXISTS, `Poll with id test-poll already exists`));
    });

    it('should find a poll by id', () => {
        const poll = pollManager.createPoll('test-poll', [mockSocket1, mockSocket2]);
        expect(pollManager.findPollOrThrow('test-poll')).toBe(poll);
    });

    it('should throw an error if a poll with the given id is not found', () => {
        expect(() => pollManager.findPollOrThrow('nonexistent-poll')).toThrow(PollError);
        expect(() => pollManager.findPollOrThrow('nonexistent-poll')).toThrowError(new PollError(BasePollErrorCode.POLLNOTFOUND, `Poll with id nonexistent-poll not found`));
    });
});
