import type { ActionReducer } from './ActionReducer.js';
import type { ControllerMethodMap } from './ControllerMethodMap.js';

export type ActionReducerOrControllerMethod<Payload = undefined, State = unknown> =
  | ControllerMethodMap
  | ActionReducer<Payload, State>;
