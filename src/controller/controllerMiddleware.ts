import { Dispatch, Middleware as ReduxMiddleware, MiddlewareAPI } from 'redux';
import { Container, IHaveDependencies } from 'cheap-di';
import { Middleware } from '../Middleware';
import { MetadataStorage } from '../MetadataStorage';
import { Action, ActionMaybeWithContainer, CallbackAction, isAction } from '../types';
import { Watcher } from './Watcher';

type MiddlewareOptions<State> = {
	watchers?: Watcher<State, any>[];
	getContainer?: () => Container & IHaveDependencies;
};

function controllerMiddleware<State>(options: MiddlewareOptions<State> = {}): ReduxMiddleware<Dispatch, State> {
	const { watchers = [], getContainer } = options;

	return (middlewareAPI: MiddlewareAPI<Dispatch, State>) =>
		(next: (action: ActionMaybeWithContainer) => void) =>
		async (action: ActionMaybeWithContainer) => {
			const controllerFactory = makeControllerFactory({
				action,
				middlewareAPI,
				getContainer,
			});

			if (!isAction(action)) {
				return;
			}

			const generator = controllerGenerator(watchers, controllerFactory, action);

			let iterator: IteratorResult<Promise<any>>;
			do {
				iterator = generator.next();
				if (!iterator.done) {
					try {
						await iterator.value;
					} catch (error) {
						console.error('Unhandled exception in controller', error);
					}
				}
			} while (!iterator.done);

			next(action);
		};
}

function makeControllerFactory<State>(params: {
	action: ActionMaybeWithContainer;
	middlewareAPI: MiddlewareAPI<Dispatch, State>;
	getContainer?: () => Container & IHaveDependencies;
}) {
	const { action, middlewareAPI, getContainer } = params;

	let factory: (watcher: Watcher<any, any>) => any;

	let container: (Container & IHaveDependencies) | undefined = undefined;
	if (typeof getContainer === 'function') {
		container = getContainer();
	}
	// scope container has higher priority
	if (action.container) {
		container = action.container;
	}

	if (container) {
		container.registerInstance(middlewareAPI).as(Middleware);

		factory = (watcher: Watcher<any, any>) => {
			const isNotRegisteredType = container!.dependencies instanceof Map && !container!.dependencies.has(watcher.type);

			// it can be registered as another type or with injected params,
			// and we should not override such registration
			if (isNotRegisteredType) {
				container!.registerType(watcher.type);
			}

			return container!.resolve(watcher.type);
		};
	} else {
		factory = (watcher: Watcher<any, any>) => watcher.instance(middlewareAPI);
	}

	return factory;
}

function controllerGenerator(
	watchers: Watcher<any, any>[],
	controllerFactory: (watcher: Watcher<any, any>) => any,
	initAction: Action
): IterableIterator<Promise<any>> {
	let actionCursor = 0;
	const actions: CallbackAction[] = [() => initAction];

	function iterator(): IteratorResult<Promise<any>> {
		if (actionCursor >= actions.length) {
			return {
				value: undefined,
				done: true,
			};
		}

		const action = actions[actionCursor]();
		const promises: Promise<void>[] = [];

		const implicitWatchers = MetadataStorage.getImplicitWatchers();
		const allWatchers = watchers.concat(implicitWatchers);

		allWatchers.forEach((watcher) => {
			const actionName = watcher.get(action.type);
			if (actionName) {
				const controller = controllerFactory(watcher);
				const promise = new Promise<void>((resolve) => {
					setTimeout(() => {
						controller[actionName](action);
						resolve();
					});
				});

				promises.push(promise);
			}
		});

		actionCursor++;

		return {
			value: Promise.all(promises).then(() => {
				if (isAction(action) && !action.stopPropagation) {
					actions.splice(actionCursor, 0, ...action.getActions());
				}
			}),
			done: false,
		};
	}

	return {
		[Symbol.iterator](): IterableIterator<any> {
			return this;
		},
		next(): IteratorResult<Promise<any>> {
			return iterator();
		},
	};
}

export { controllerMiddleware };
