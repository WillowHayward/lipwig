import { CommonError } from "../common";

export const HostError = {
    // General
    MALFORMED: CommonError.MALFORMED,
    USERNOTFOUND: CommonError.USERNOTFOUND,
    // Local users
    LOCALUSEREXISTS: 'LOCALUSEREXISTS',
    LOCALUSERNOTFOUND: 'LOCALUSERNOTFOUND',
    // Poll
    POLLALREADYEXISTS: 'POLLALREADYEXISTS',
    // Rejoin
    ALREADYCONNECTED: CommonError.ALREADYCONNECTED,
} as const;
// TODO: A mapping of arguments paired with errors would probably be useful
