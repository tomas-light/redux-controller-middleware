import { Dispatch, MiddlewareAPI } from 'redux';
import type { Container } from 'cheap-di';
import { Action, Constructor } from './types/index.js';

export type ControllerMethodMap = Map<
  Constructor, // controller ref
  string // method name
>;

export type ActionReducerParameters<Payload, State = unknown> = MiddlewareAPI<Dispatch, State> & {
  action: Action<Payload>;
  container: Pick<Container, 'resolve'> | undefined;
};
export type ActionReducer<Payload, State> = (parameters: ActionReducerParameters<Payload, State>) => any;

export type ActionReducerOrControllerMethod<Payload = undefined, State = unknown> =
  | ControllerMethodMap
  | ActionReducer<Payload, State>;

export const actionToControllerMap = new Map<
  string, // action type
  ActionReducerOrControllerMethod<any, any>
>();

// todo: use context.metadata for passing method names from method-decorator, when it will be ready
export const methodNamesTemporaryBox = [] as string[];
