import { AppAction } from './AppAction';
import { Action, ActionType } from './types';

export function createAction<Payload>(actionType: ActionType, payload?: Payload): Action<Payload> {
  let normalizedPayload;

  if (typeof payload === 'object' && !Array.isArray(payload)) {
    normalizedPayload = { ...payload };
  } else {
    normalizedPayload = payload;
  }

  return new AppAction<Payload>(actionType, normalizedPayload).toPlainObject();
}
