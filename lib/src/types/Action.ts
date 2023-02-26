import { AnyAction } from 'redux';

export interface Action<Payload = undefined> extends AnyAction {
	payload: Payload;

	/** next actions chain (actions that will be dispatched after handling of this one) */
	readonly actions: (Action | ActionFactory)[];

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
	addNextActions(...actions: (Action<any> | ActionFactory)[]): Action<Payload>;

	/** If the action has next actions in chain, this method stops them from dispatching */
	stop(): void;

	/** returns `next actions chain of this action */
	getActions(): ActionFactory[];
}

export type ActionFactory = () => Action<any>;
