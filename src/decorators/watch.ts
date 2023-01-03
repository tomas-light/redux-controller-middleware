import { watcher } from '../controller';
import { createAction } from '../createAction';
import { MetadataStorage } from '../MetadataStorage';
import { controllerWatcherSymbol, watchersSymbol } from '../symbols';
import { ActionType, Constructor, Controller, ControllerConstructor, WatchedConstructor } from '../types';
import { extractMethodNameFromActionType } from './extractMethodNameFromActionType';
import { InheritancePreserver } from './InheritancePreserver';
import { makeActionType } from './makeActionType';

type Prototype<T = any> = {
	constructor: Constructor<T>;
};

// constructor
function watch<TController extends Controller, TConstructor extends ControllerConstructor<TController>>(
	constructor: TConstructor
): TConstructor;
// method factory
function watch(actionType: string): (prototype: any, propertyKey: string) => void;
// method
function watch(prototype: any, propertyKey: string): void;

function watch(constructorOrActionType?: any) {
	if (arguments.length === 1 && typeof constructorOrActionType !== 'string') {
		return watchConstructor(constructorOrActionType as Constructor);
	}

	if (arguments.length === 3) {
		// eslint-disable-next-line prefer-spread, prefer-rest-params
		return watchMethod().apply(null, arguments as any);
	}

	return watchMethod(constructorOrActionType as string);
}

function watchConstructor<TController extends Controller, TConstructor extends ControllerConstructor<TController>>(
	constructor: TConstructor
): TConstructor {
	const watchedConstructor = InheritancePreserver.getModifiedConstructor<WatchedConstructor<TController>>(constructor);
	const actionTypeToMethodNameRecords = watchedConstructor[watchersSymbol];

	if (actionTypeToMethodNameRecords) {
		// add action creators to static methods of the controller
		Object.keys(actionTypeToMethodNameRecords).forEach((actionType) => {
			const staticMethodName = extractMethodNameFromActionType(actionType, watchedConstructor.name) as string;

			watchedConstructor[staticMethodName] = (payload?: any) => createAction(actionType, payload);
		});

		let controllerWatcher = watchedConstructor[controllerWatcherSymbol];
		if (!controllerWatcher) {
			watchedConstructor[controllerWatcherSymbol] = watcher(watchedConstructor, actionTypeToMethodNameRecords);
			controllerWatcher = watchedConstructor[controllerWatcherSymbol];
			MetadataStorage.addImplicitWatcher(controllerWatcher);
		}
	}

	return constructor;
}

function watchMethod(actionType?: ActionType) {
	return function (prototype: Prototype, propertyKey: string) {
		let watched = InheritancePreserver.getModifiedConstructor<WatchedConstructor>(prototype.constructor);
		if (!watched) {
			watched = prototype.constructor as WatchedConstructor;

			if (!watched[watchersSymbol]) {
				watched[watchersSymbol] = {};
			}
		}

		if (!actionType) {
			actionType = propertyKey;
		}

		actionType = makeActionType(prototype.constructor.name, actionType);

		const watchers = watched[watchersSymbol];
		if (watchers && !watchers[actionType]) {
			watchers[actionType] = propertyKey;
		}

		InheritancePreserver.constructorModified(watched ?? prototype.constructor);
	};
}

export { watch };
