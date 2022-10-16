import { createAction } from './createAction';
import {
  ActionWithCallback,
  CallbackAction,
  Action,
} from './types';

export function createActionWithCallback(actionType: string, payload: any = {}): ActionWithCallback {
  const appAction = createAction(actionType, payload);

  const actionWithCallback: ActionWithCallback = (callbackAction: CallbackAction): Action => {
    if (typeof callbackAction === 'function') {
      appAction.callbackAction = callbackAction;
    }
    return appAction;
  };

  return actionWithCallback;
}
