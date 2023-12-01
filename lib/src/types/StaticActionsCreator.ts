import { Action } from './Action';

export type StaticActionsCreator = {
  [actionName: string]: (payload?: any) => Action;
};
