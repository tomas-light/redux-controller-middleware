import { ActionType, ControllerConstructor, ControllerMethodNames, Watcher } from '../types';

function watcher<TConstructor extends ControllerConstructor>(
	Controller: TConstructor,
	actionTypeToMethodNameRecords: Record<ActionType, ControllerMethodNames<TConstructor>>
): Watcher {
	return {
		get: (actionType) => actionTypeToMethodNameRecords[actionType],
		type: Controller,
	};
}

export { watcher };
