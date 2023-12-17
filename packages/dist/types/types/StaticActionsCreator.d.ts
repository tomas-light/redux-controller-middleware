import { Action } from './Action.js';
export type StaticActionsCreator = {
    [actionName: string]: (payload?: any) => Action;
};
