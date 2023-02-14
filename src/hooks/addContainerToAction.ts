import { Action as ReduxAction } from 'redux';
import { DiContextType } from 'cheap-di-react';
import { AppAction } from '../AppAction';
import { createAction } from '../createAction';

function addContainerToAction(action: ReduxAction, diContext: DiContextType) {
	if (!diContext.container) {
		return action;
	}

	if (action instanceof AppAction) {
		action.container = diContext.container;
		return action;
	}

	const { type } = action;
	delete action.type;

	const newAction = createAction<any>(type, {});
	for (const [key, value] of Object.entries(action)) {
		newAction.payload[key] = value;
	}
	return newAction;
}

export { addContainerToAction };
