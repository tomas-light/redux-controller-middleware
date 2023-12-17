import { UnknownAction } from 'redux';
import { AppAction } from './AppAction.js';
import { Action } from './types/index.js';

export function createAction<Payload>(actionType: UnknownAction['type'], payload?: Payload): Action<Payload> {
  let normalizedPayload;

  if (typeof payload === 'object' && !Array.isArray(payload)) {
    normalizedPayload = { ...payload };
  } else {
    normalizedPayload = payload;
  }

  return new AppAction<Payload>(actionType, normalizedPayload).toPlainObject();
}
