import { Container, IHaveDependencies } from 'cheap-di';
import { Dispatch, MiddlewareAPI } from 'redux';
import { Controller, Watcher } from '../types';

type ControllerFactory = (watcher: Watcher) => Controller;

function makeControllerFactory<State>(
	middlewareAPI: MiddlewareAPI<Dispatch, State>,
	container: (Container & IHaveDependencies) | undefined
): ControllerFactory {
	if (!container) {
		return (watcher) => new watcher.type(middlewareAPI);
	}

	return (watcher) => {
		const isNotRegisteredType = container.dependencies instanceof Map && !container.dependencies.has(watcher.type);

		// todo: do we really needed to register it? bad side effect
		// it can be registered as another type or with injected params,
		// and we should not override such registration
		if (isNotRegisteredType) {
			container.registerType(watcher.type);
		}

		return container.resolve(watcher.type) as Controller;
	};
}

export { makeControllerFactory };
