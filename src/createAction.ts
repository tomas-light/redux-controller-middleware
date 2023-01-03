import { AppAction } from './AppAction';
import { Action, ActionType } from './types';

export function createAction<Payload>(actionType: ActionType, payload: Payload = {} as any): Action {
	let _payload;

	if (typeof payload === 'object' && !Array.isArray(payload)) {
		_payload = { ...payload };
	} else {
		_payload = payload;
	}

	return new AppAction(actionType, _payload).toPlainObject();
}
