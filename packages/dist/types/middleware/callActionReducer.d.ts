import type { DependencyResolver } from 'cheap-di';
import type { MiddlewareAPI } from 'redux';
import type { Action, ActionReducerOrControllerMethod } from '../types/index.js';
type Parameters<Payload = undefined, State = unknown> = {
    action: Action<Payload>;
    container?: DependencyResolver | (() => DependencyResolver);
    actionReducer: ActionReducerOrControllerMethod<Payload, State>;
    middlewareAPI: MiddlewareAPI;
};
export declare function callActionReducer<Payload = undefined, State = unknown>(parameters: Parameters<Payload, State>): Promise<void>;
export {};
