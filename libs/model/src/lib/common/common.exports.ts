import { BaseClientErrorCode, BaseHostErrorCode, BaseJoinErrorCode, BasePollErrorCode, BaseRejoinErrorCode, GenericErrorCode } from './error.model';

export { BaseMessage } from './common.model'; // TODO: Confirm if this is used anywhere

export * from './logs.model'; // TODO: Rework this to be cleaner, or move to server (or standardise with js)

// TODO: Divide these these by connection type, move base types to different folders
export type HostErrorCode = BaseHostErrorCode | GenericErrorCode;
export type ClientErrorCode = BaseClientErrorCode | GenericErrorCode;
export type JoinErrorCode = BaseJoinErrorCode | GenericErrorCode;
export type RejoinErrorCode = BaseRejoinErrorCode | GenericErrorCode;
export type PollErrorCode = BasePollErrorCode | GenericErrorCode;
export type ERROR_CODE = HostErrorCode | ClientErrorCode | JoinErrorCode | RejoinErrorCode | PollErrorCode; // TODO: Rename for consistency
