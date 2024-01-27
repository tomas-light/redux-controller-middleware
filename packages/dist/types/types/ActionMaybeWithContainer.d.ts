import type { Container } from 'cheap-di';
import type { Action } from './Action.js';
export interface ActionMaybeWithContainer<Payload = undefined> extends Action<Payload> {
    container?: Container;
}
export interface ActionWithContainer<Payload = undefined> extends Action<Payload> {
    container: Container;
}
export declare function isActionWithContainer<Payload = undefined>(action: Action<Payload>): action is ActionWithContainer<Payload>;
