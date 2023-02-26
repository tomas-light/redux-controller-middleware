import { createAction } from './createAction';
import { Action, isAction } from './types';

export const FALLBACK_ACTION_TYPE = 'No actions were passed to chain function';

export function chainActions(...actions: Action<any>[]) {
	let appActions: Action[] = [];
	if (Array.isArray(actions)) {
		appActions = actions.filter((maybeNotAnAction) => isAction(maybeNotAnAction));
	}

	if (!appActions.length) {
		return createAction(FALLBACK_ACTION_TYPE);
	}

	const firstAction = appActions[0];
	let action = firstAction;

	for (let actionIndex = 1; actionIndex < appActions.length; actionIndex++) {
		const nextAction = appActions[actionIndex];
		action.addNextActions(nextAction);
		action = nextAction;
	}

	return firstAction;
}
