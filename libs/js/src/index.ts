export * from './lib/Lipwig';
export * from './lib/host';
export * from './lib/client';
import * as Logger from 'loglevel';
//export * from './lib/Admin';

Logger.setDefaultLevel(Logger.levels.DEBUG);


// Export types
import { CreateOptions, JoinOptions, RoomQuery, ERROR_CODE, CLOSE_CODE } from '@lipwig/model';

export {
    CreateOptions, JoinOptions, RoomQuery, ERROR_CODE, CLOSE_CODE
}
