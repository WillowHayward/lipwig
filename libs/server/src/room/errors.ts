import { ClientErrorCode, HostErrorCode, PollErrorCode, JoinErrorCode, RejoinErrorCode } from "@lipwig/model";
import { WsException } from '@nestjs/websockets';

// TODO: On reflection, we might only need LwException (if that?). Investigate how the exception filter handles inheritance
/**
 * Formats an error message.
 *
 * @param {string} errorCode - The error code.
 * @param {string} [message] - The error message. Optional.
 * @returns {string} The formatted error message.
 */
function formatError(errorCode: string, message?: string): string {
    return message ? `${errorCode}: ${message}` : errorCode;
}

/**
 * Base class for all errors that can result from a lipwig message
 */
class LwException<T extends string> extends WsException {
    constructor(public errorCode: T, message?: string) {
        super(formatError(errorCode, message));
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Error class for host-related errors.
 */
export class HostError extends LwException<HostErrorCode> { }

/**
 * Error class for client-related errors.
 */
export class ClientError extends LwException<ClientErrorCode> { }

/**
 * Error class for poll-related errors.
 */
export class PollError extends LwException<PollErrorCode> { }

/**
 * Error class for join-related errors.
 */
export class JoinError extends LwException<JoinErrorCode> { }

/**
 * Error class for rejoin-related errors.
 */
export class RejoinError extends LwException<RejoinErrorCode> { }

