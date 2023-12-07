import { AppAction } from './AppAction.js';
import { Action, ActionType } from './types/index.js';

export function createAction<Payload>(actionType: ActionType, payload?: Payload): Action<Payload> {
  let normalizedPayload;

  if (typeof payload === 'object' && !Array.isArray(payload)) {
    normalizedPayload = { ...payload };
  } else {
    normalizedPayload = payload;
  }

  return new AppAction<Payload>(actionType, normalizedPayload).toPlainObject();
}
