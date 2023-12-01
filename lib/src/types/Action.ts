import { AnyAction } from 'redux';

export interface Action<Payload = undefined> extends AnyAction {
  payload: Payload;

  /** next actions chain (actions that will be dispatched after handling of this one) */
  readonly actions: (Action<any> | ActionFactory)[];

  /** is action chain stopped or not */
  readonly stopPropagation: boolean;

  /**
   * Add an action (or actions) that will be dispatched right after of executing this action.
   * @example
   * const authorizeAction = createAction('AUTH');
   * const loadProfileAction = createAction('LOAD_MY_PROFILE');
   * const loadSettingsAction = createAction('LOAD_MY_SETTINGS');
   * authorizeAction.addNextActions(loadProfileAction, loadSettingsAction);
   * dispatch(authorizeAction);
   * */
  addNextActions(...actions: Action['actions']): Action<Payload>;

  /** If the action has next actions in chain, this method stops them from dispatching */
  stop(): void;

  /** returns `next actions chain of this action */
  // getActions(): Action['actions'];

  /** if action has next actions, the middleware will add promise resolving
   * to this property, that will be triggered after all next action will be handled.
   * It is signal for the middleware: this action was handled, and we can take
   * next action in a chain */
  handled?: () => void;
}

export type ActionFactory = () => Action<any> | void | Promise<void>;
