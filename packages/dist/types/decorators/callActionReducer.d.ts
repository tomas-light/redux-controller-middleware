import { DependencyResolver } from 'cheap-di';
import { MiddlewareAPI } from 'redux';
import { ActionReducerOrControllerMethod } from '../constants.js';
import { Action } from '../types/index.js';
type Parameters<Payload = undefined, State = unknown> = {
    action: Action<Payload>;
    container?: DependencyResolver | (() => DependencyResolver);
    actionReducer: ActionReducerOrControllerMethod<Payload, State>;
    middlewareAPI: MiddlewareAPI;
};
export declare function callActionReducer<Payload = undefined, State = unknown>(parameters: Parameters<Payload, State>): Promise<void>;
export {};
