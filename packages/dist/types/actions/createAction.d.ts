import { UnknownAction } from 'redux';
import { Action } from '../types/index.js';
export declare function createAction<Payload>(actionType: UnknownAction['type'], payload?: Payload): Action<Payload>;
