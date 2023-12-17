import { Dispatch, MiddlewareAPI } from 'redux';
import type { Container } from 'cheap-di';
import { Action, Constructor } from './types/index.js';
export type ControllerMethodMap = Map<Constructor, // controller ref
string>;
export type ActionReducerParameters<Payload, State = unknown> = MiddlewareAPI<Dispatch, State> & {
    action: Action<Payload>;
    container: Pick<Container, 'resolve'> | undefined;
};
export type ActionReducer<Payload, State> = (parameters: ActionReducerParameters<Payload, State>) => any;
export type ActionReducerOrControllerMethod<Payload = undefined, State = unknown> = ControllerMethodMap | ActionReducer<Payload, State>;
export declare const actionToControllerMap: Map<string, ActionReducerOrControllerMethod<any, any>>;
export declare const methodNamesTemporaryBox: string[];
