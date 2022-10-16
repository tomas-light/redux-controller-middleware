import { Container, IHaveDependencies } from "../../cheap-di";
import { Action, ActionMaybeWithContainer, CallbackAction } from './types';

export class AppAction<TPayload = any> implements ActionMaybeWithContainer<TPayload> {
  type: any;
  payload: TPayload;

  callbackAction?: CallbackAction;
  actions?: AppAction[];
  stopPropagation?: boolean;
  container?: Container & IHaveDependencies;

  constructor(type: string, payload?: TPayload) {
    this.type = type;
    this.payload = payload as TPayload;
    this.actions = [];
    this.stopPropagation = false;
  }

  static stop(appAction: Action): void {
    appAction.stopPropagation = true;
  }

  static getActions(appAction: Action): CallbackAction[] {
    const actions: CallbackAction[] = [];

    if (typeof appAction.callbackAction === 'function') {
      actions.push(appAction.callbackAction);
    }

    if (Array.isArray(appAction.actions) && appAction.actions.length > 0) {
      appAction.actions.forEach(action => {
        actions.push(() => action);
      });
    }

    return actions;
  }

  stop(): void {
    AppAction.stop(this);
  }

  getActions(): CallbackAction[] {
    return AppAction.getActions(this);
  }

  toPlainObject(): Action {
    const keys = Object.keys(this) as (keyof AppAction)[];
    const plainObject: Action = {} as any;

    keys.forEach(key => {
      if (key !== 'toPlainObject') {
        plainObject[key] = this[key];
      }
    });

    plainObject.stop = function () {
      AppAction.stop(this);
    };
    plainObject.getActions = function () {
      return AppAction.getActions(this);
    };

    return plainObject;
  }
}
