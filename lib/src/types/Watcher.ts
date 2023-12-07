import { ActionType } from './ActionType.js';
import { ControllerConstructor } from './ControllerConstructor.js';

export type Watcher = {
  get: (actionType: ActionType) => string | undefined;
  type: ControllerConstructor;
};
