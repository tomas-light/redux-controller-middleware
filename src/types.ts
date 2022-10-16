import { AnyAction } from 'redux';
import { Container, IHaveDependencies } from '../../cheap-di';
import { Watcher } from './controller';
import { controllerWatcherSymbol, inheritancePreserveSymbol, watchersSymbol } from './symbols';

interface Action<Payload = any> extends AnyAction {
	payload: Payload;

	callbackAction?: CallbackAction;
	actions?: Action[];
	stopPropagation?: boolean;

	stop(): void;

	getActions(): CallbackAction[];
}

interface ActionMaybeWithContainer<Payload = any> extends Action<Payload> {
	container?: Container & IHaveDependencies;
}

type ActionWithCallback = (callbackAction: CallbackAction) => Action;
type CallbackAction = () => Action;

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

type WatchedConstructor<T = any> = Constructor<T> & {
	[inheritancePreserveSymbol]?: T;
	[watchersSymbol]?: {
		[actionType: string]: string; // callable method name
	};
	[controllerWatcherSymbol]?: Watcher<any, T>;
};

interface Controller {}

type IsString<Type> = Type extends string ? Type : never;

type SimpleActions<Watchers extends readonly any[]> = Watchers extends (infer Item)[]
	? {
			[property in IsString<Item>]: () => Action;
	  }
	: never;

type ComplexAction<Watchers extends readonly any[]> = Watchers extends (infer Item)[]
	? {
			[property in Item extends [infer ActionType, NonNullable<any>]
				? ActionType extends string
					? ActionType
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
	Controller,
	Action,
	ActionWithCallback,
	ActionMaybeWithContainer,
	CallbackAction,
	Constructor,
	WatchedConstructor,
	DecoratedWatchedController,
	WatchedController,
};

export { isAction };
