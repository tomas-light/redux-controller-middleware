import { Action } from './Action.js';
import { IsString } from './IsString.js';

export type ControllerWithCustomActionTypes<Watchers extends Record<string, any>> = {
  [actionType in IsString<keyof Watchers>]: Watchers[actionType] extends NonNullable<infer Payload>
    ? (payload: Payload) => Action<Payload>
    : () => Action;
};
