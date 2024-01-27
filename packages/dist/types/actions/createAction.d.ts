import type { UnknownAction } from 'redux';
import type { Action } from '../types/index.js';
export declare function createAction<Payload>(actionType: UnknownAction['type'], payload?: Payload): Action<Payload>;
