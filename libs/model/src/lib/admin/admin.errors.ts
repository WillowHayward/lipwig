import { CommonError } from "../common";

export const AdminError = {
    MALFORMED: CommonError.MALFORMED,
} as const;
// TODO: A mapping of arguments paired with errors would probably be useful
