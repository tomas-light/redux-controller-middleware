import { Container } from 'cheap-di';
import { Action, ActionFactory, ActionMaybeWithContainer } from '../types/index.js';
import { Writable } from '../types/Writable.js';

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

  static stop<Payload>(appAction: Action<Payload> | AppAction<Payload>): void {
    (appAction as Writable<typeof appAction>).stopPropagation = true;
  }

  static getActions<Payload>(appAction: Action<Payload> | AppAction<Payload>): Action['actions'] {
    if (!Array.isArray(appAction.actions)) {
      return [];
    }

    return appAction.actions;
  }

  addNextActions(...actions: (ActionFactory | Action<unknown>)[]) {
    AppAction.addNextActions(this, ...actions);
    return this as unknown as Action<Payload>;
  }

  stop(): void {
    AppAction.stop(this);
  }

  toPlainObject(): Action<Payload> {
    const keys = Object.keys(this) as (keyof AppAction<Payload>)[];
    const plainObject = {} as Action<Payload>;

    keys.forEach((key) => {
      // skip property
      if (key === 'toPlainObject') {
        return;
      }
      if (key === 'actions') {
        plainObject[key as any] = this[key];
        return;
      }
      if (key === 'stopPropagation') {
        plainObject[key as any] = this[key];
        return;
      }
      plainObject[key] = this[key];
    });

    plainObject.addNextActions = function (...actions: (ActionFactory | Action<unknown>)[]) {
      return AppAction.addNextActions(this, ...actions);
    };
    plainObject.stop = function () {
      AppAction.stop(this);
    };
    plainObject.getActions = function () {
      return AppAction.getActions(this);
    };

    return plainObject;
  }
}
