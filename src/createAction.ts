import { Action } from './types';
import { AppAction } from './AppAction';

export function createAction<Payload>(actionType: string, payload: Payload = {} as any): Action {
  let _payload;

  if (typeof payload === 'object' && !Array.isArray(payload)) {
    _payload = { ...payload };
  }
  else {
    _payload = payload;
  }

  return new AppAction(actionType, _payload).toPlainObject();
}
