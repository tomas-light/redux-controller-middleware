import { ActionReducer } from './ActionReducer.js';
import { ControllerMethodMap } from './ControllerMethodMap.js';

export type ActionReducerOrControllerMethod<Payload = undefined, State = unknown> =
  | ControllerMethodMap
  | ActionReducer<Payload, State>;
