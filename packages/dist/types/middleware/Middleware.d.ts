import type { Dispatch, MiddlewareAPI } from 'redux';
import type { Action } from '../types/Action.js';
/**
 * this class is needed to be able to resolve redux middleware via DI,
 * class is used as a token for such resolving
 */
export declare class Middleware<State = any> implements MiddlewareAPI<Dispatch<Action<unknown>>, State> {
    constructor();
    dispatch: Dispatch<Action<unknown>>;
    getState(): State;
}
