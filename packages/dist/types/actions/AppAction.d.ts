import { Container } from 'cheap-di';
import { Action, ActionFactory, ActionMaybeWithContainer } from '../types/index.js';
export declare class AppAction<Payload = undefined> implements ActionMaybeWithContainer<Payload> {
    type: any;
    payload: Payload;
    readonly actions: (ActionFactory | Action<unknown>)[];
    stopPropagation: boolean;
    container?: Container;
    [extraProps: string]: unknown;
    constructor(type: string, payload?: Payload);
    static addNextActions<Payload>(appAction: Action<Payload> | AppAction<Payload>, ...actions: Action['actions']): Action<Payload>;
    static stop<Payload>(appAction: Action<Payload> | AppAction<Payload>): void;
    static getActions<Payload>(appAction: Action<Payload> | AppAction<Payload>): Action['actions'];
    addNextActions(...actions: (ActionFactory | Action<unknown>)[]): Action<Payload>;
    stop(): void;
    toPlainObject(): Action<Payload>;
}
