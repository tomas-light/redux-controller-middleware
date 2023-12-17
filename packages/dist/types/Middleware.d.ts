import { Dispatch, MiddlewareAPI } from 'redux';
import { Action } from './types/index.js';
declare class Middleware<State = any> implements MiddlewareAPI<Dispatch<Action<unknown>>, State> {
    constructor();
    dispatch: Dispatch<Action<unknown>>;
    getState(): State;
}
export { Middleware };
