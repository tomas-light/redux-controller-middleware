import { Container, IHaveDependencies } from 'cheap-di';
import { Dispatch, Middleware as ReduxMiddleware, MiddlewareAPI } from 'redux';
import { MetadataStorage } from '../MetadataStorage';
import { Middleware } from '../Middleware';
import { Action, ActionFactory, ActionMaybeWithContainer, isAction } from '../types';
import { isDuckPromise } from './isDuckPromise';
import { makeControllerFactory } from './makeControllerFactory';
import { tryToFindDependencyContainer } from './tryToFindDependencyContainer';
import { Watcher } from './Watcher';

type MiddlewareOptions = {
	watchers?: Watcher[];
	getContainer?: () => Container & IHaveDependencies;
};

function controllerMiddleware<State>(options: MiddlewareOptions = {}): ReduxMiddleware<Dispatch, State> {
	const { watchers = [], getContainer } = options;

	return (middlewareAPI: MiddlewareAPI<Dispatch, State>) => {
		return (next: (action: ActionMaybeWithContainer) => void) => {
			return async (action: ActionMaybeWithContainer) => {
				const container = tryToFindDependencyContainer(action, getContainer);
				if (container) {
					container.registerInstance(middlewareAPI).as(Middleware);
				}

				if (!isAction(action)) {
					return;
				}

				const controllerFactory = makeControllerFactory(middlewareAPI, container);
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
		};
	};
}

function controllerGenerator(
	watchers: Watcher[],
	controllerFactory: (watcher: Watcher) => any,
	initAction: Action
): IterableIterator<Promise<any>> {
	let actionCursor = 0;
	const actions: ActionFactory[] = [() => initAction];

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
						const maybePromise = controller[actionName](action);
						if (isDuckPromise(maybePromise)) {
							maybePromise.then(resolve);
						} else {
							resolve();
						}
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

export type { MiddlewareOptions };
export { controllerMiddleware };
