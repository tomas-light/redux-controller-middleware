import { UnknownAction } from 'redux';
import { ControllerConstructor } from './ControllerConstructor.js';

export type Watcher = {
  get: (actionType: UnknownAction['type']) => string | undefined;
  type: ControllerConstructor;
};
