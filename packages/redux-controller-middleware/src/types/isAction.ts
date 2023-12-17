import { Action } from './Action.js';

export function isAction(action: any): action is Action {
  return (
    action &&
    typeof action === 'object' &&
    'payload' in action &&
    'actions' in action &&
    'stopPropagation' in action &&
    typeof action.stop === 'function' &&
    typeof action.getActions === 'function'
  );
}