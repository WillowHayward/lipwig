import { CommonError } from "../common";

export const ClientError = {
    // General
    MALFORMED: CommonError.MALFORMED,
    INSUFFICIENTPERMISSIONS: 'INSUFFICIENTPERMISSIONS', // TODO: Phase this out. Each connection type should have a list of valid events, and anything outside of should throw MALFORMED
    // Join
    ROOMNOTFOUND: 'ROOMNOTFOUND',
    ROOMFULL: 'ROOMFULL',
    ROOMCLOSED: 'ROOMCLOSED',
    ROOMLOCKED: 'ROOMLOCKED',
    INCORRECTPASSWORD: 'INCORRECTPASSWORD',
    MISSINGPARAM: 'MISSINGPARAM',
    REJECTED: 'REJECTED', // TODO: Is this an error, or an event?
    // Rejoin
    USERNOTFOUND: CommonError.USERNOTFOUND,
    ALREADYCONNECTED: CommonError.ALREADYCONNECTED,
    // Poll
    POLLCLOSED: 'POLLCLOSED', // TODO: Is there a context in which this might be
    POLLALREADYRESPONSED: 'POLLALREADYRESPONSED',
    POLLUSERNOTFOUND: 'POLLUSERNOTFOUND',
    POLLNOTFOUND: 'POLLNOTFOUND',
} as const;
// TODO: A mapping of arguments paired with errors would probably be useful
