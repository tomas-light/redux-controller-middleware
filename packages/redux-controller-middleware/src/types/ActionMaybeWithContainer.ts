import { Container } from 'cheap-di';
import { Action } from './Action.js';

export interface ActionMaybeWithContainer<Payload = undefined> extends Action<Payload> {
  container?: Container;
}
export interface ActionWithContainer<Payload = undefined> extends Action<Payload> {
  container: Container;
}

export function isActionWithContainer<Payload = undefined>(
  action: Action<Payload>
): action is ActionWithContainer<Payload> {
  return ('container' satisfies keyof ActionMaybeWithContainer) in action && action.container != null;
}
