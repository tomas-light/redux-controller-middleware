import { AnyAction } from 'redux';
import { Container, IHaveDependencies } from '../../cheap-di';
import { Watcher } from './controller';
import { Middleware } from './Middleware';
import { controllerWatcherSymbol, inheritancePreserveSymbol, watchersSymbol } from './symbols';

type ActionType = string;

interface Action<Payload = any> extends AnyAction {
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
	addNextActions(...actions: (Action | ActionFactory)[]): void;

	/** If the action has next actions in chain, this method stops them from dispatching */
	stop(): void;

	/** returns `next actions chain of this action */
	getActions(): ActionFactory[];
}

interface ActionMaybeWithContainer<Payload = any> extends Action<Payload> {
	container?: Container & IHaveDependencies;
}

type ActionWithCallback = (actionFactory: ActionFactory) => Action;
type ActionFactory = () => Action;

function isAction(action: any): action is Action {
	return (
		'payload' in action &&
		'actions' in action &&
		'stopPropagation' in action &&
		typeof action.stop === 'function' &&
		typeof action.getActions === 'function'
	);
}

type Constructor<T = any> = new (...args: any[]) => T;

type StaticActionsCreator = {
	[actionName: string]: (payload?: any) => Action;
};

type WatchedConstructor<TController extends Controller = Controller> = Constructor<TController> & {
	[inheritancePreserveSymbol]?: TController;
	[watchersSymbol]?: {
		[actionType: ActionType]: string; // callable method name
	};
	[controllerWatcherSymbol]?: Watcher;
} & StaticActionsCreator;

interface ControllerConstructor<State extends {} = {}> {
	new (middlewareAPI: Middleware, ...args: any[]): Controller<State>;
}
interface Controller<State extends {} = any> {}

type IsString<Type> = Type extends string ? Type : never;

type SimpleActions<Watchers extends readonly any[]> = Watchers extends (infer Item)[]
	? {
			[property in IsString<Item>]: () => Action;
	  }
	: never;

type ComplexAction<Watchers extends readonly any[]> = Watchers extends (infer Item)[]
	? {
			[property in Item extends [infer TActionType, NonNullable<any>]
				? TActionType extends ActionType
					? TActionType
					: never
				: never]: Item extends [property, NonNullable<infer Payload>] ? (payload: Payload) => Action<Payload> : never;
	  }
	: never;

type DecoratedWatchedController<Watchers extends readonly any[]> = SimpleActions<Watchers> & ComplexAction<Watchers>;

type WatchedController<TController extends Controller> = {
	[methodName in keyof TController]: TController[methodName] extends (parameter: infer MethodParameter) => any
		? MethodParameter extends Action<infer Payload>
			? Payload extends NonNullable<any>
				? (payload: Payload) => Action<Payload>
				: () => Action
			: (...params: Parameters<TController[methodName]>) => Action
		: TController[methodName];
};

export type {
	ActionType,
	ControllerConstructor,
	Controller,
	Action,
	ActionWithCallback,
	ActionMaybeWithContainer,
	ActionFactory,
	Constructor,
	WatchedConstructor,
	DecoratedWatchedController,
	WatchedController,
};

export { isAction };
