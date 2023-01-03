import { ActionType } from './ActionType';
import { ControllerConstructor } from './ControllerConstructor';

export type Watcher = {
	get: (actionType: ActionType) => string | undefined;
	type: ControllerConstructor;
};
