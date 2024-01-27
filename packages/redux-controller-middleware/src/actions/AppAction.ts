import type { Container } from 'cheap-di';
import type { Action, ActionFactory, ActionMaybeWithContainer } from '../types/index.js';
import type { Writable } from '../types/Writable.js';

export class AppAction<Payload = undefined> implements ActionMaybeWithContainer<Payload> {
  type: any;
  payload: Payload;

  readonly actions: (ActionFactory | Action<unknown>)[];

  stopPropagation: boolean;
  container?: Container;

  // implementation of UnknownAction
  [extraProps: string]: unknown;

  constructor(type: string, payload?: Payload) {
    this.type = type;
    this.payload = payload as Payload;
    this.actions = [];
    this.stopPropagation = false;
  }

  static addNextActions<Payload>(appAction: Action<Payload> | AppAction<Payload>, ...actions: Action['actions']) {
    appAction.actions.push(...actions);
    return appAction as Action<Payload>;
  }

  static getActions<Payload>(appAction: Action<Payload> | AppAction<Payload>): Action['actions'] {
    if (!Array.isArray(appAction.actions)) {
      return [];
    }

    return appAction.actions;
  }

  toPlainObject(): Action<Payload> {
    const plainObject = Object.assign({}, this) as Action<Payload>;
    delete plainObject.toPlainObject;
    return plainObject;
  }
}
