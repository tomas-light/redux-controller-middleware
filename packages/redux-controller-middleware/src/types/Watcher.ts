import type { UnknownAction } from 'redux';
import type { ControllerConstructor } from './ControllerConstructor.js';

export type Watcher = {
  get: (actionType: UnknownAction['type']) => string | undefined;
  type: ControllerConstructor;
};
