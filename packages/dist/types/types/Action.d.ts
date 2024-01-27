import type { UnknownAction } from 'redux';
export type ActionFactory = () => Action<unknown> | void | Promise<void>;
export interface Action<Payload = undefined> extends UnknownAction {
    payload: Payload;
    /** next actions chain (actions that will be dispatched after handling of this one) */
    readonly actions: (ActionFactory | Action<unknown>)[];
    /** is action chain stopped or not */
    readonly stopPropagation: boolean;
}
export declare function isAction(action: any): action is Action;
