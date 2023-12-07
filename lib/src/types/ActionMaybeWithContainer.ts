import { Container } from 'cheap-di';
import { Action } from './Action.js';

export interface ActionMaybeWithContainer<Payload = any> extends Action<Payload> {
  container?: Container;
}
