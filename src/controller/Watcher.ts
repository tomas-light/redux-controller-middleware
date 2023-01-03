import { ActionType, ControllerConstructor } from '../types';

type Watcher = {
	get: (actionType: ActionType) => string | undefined;
	type: ControllerConstructor;
};

function watcher<MethodNames extends string = string>(
	Controller: ControllerConstructor,
	actionTypeToMethodNameRecords: Record<ActionType, MethodNames>
): Watcher {
	return {
		get: (actionType) => actionTypeToMethodNameRecords[actionType],
		type: Controller,
	};
}

export { watcher };
export type { Watcher };
