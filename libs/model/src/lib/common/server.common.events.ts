import { ERROR_EVENT } from './common.model';

export const BaseServerCommonEvent = {
    ERROR: ERROR_EVENT,
} as const;

export interface ErrorMessageData<T extends object> {
    error: keyof T;
    message?: string;
}
