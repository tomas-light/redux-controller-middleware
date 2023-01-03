import { Action } from './Action';

export function isAction(action: any): action is Action {
	return (
		'payload' in action &&
		'actions' in action &&
		'stopPropagation' in action &&
		typeof action.stop === 'function' &&
		typeof action.getActions === 'function'
	);
}
