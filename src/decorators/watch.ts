import { watcher } from '../controller';
import { createAction } from '../createAction';
import { MetadataStorage } from '../MetadataStorage';
import { controllerWatcherSymbol, watchersSymbol } from '../symbols';
import {
  Constructor,
  WatchedConstructor,
} from '../types';
import { InheritancePreserver } from './InheritancePreserver';
import { extractMethodNameFromActionType } from './extractMethodNameFromActionType';
import { makeActionType } from './makeActionType';

type Prototype<T = any> = {
  constructor: Constructor<T>;
}

// constructor
function watch<TConstructor extends Constructor>(constructor: TConstructor): TConstructor;
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

function watchConstructor(constructor: Constructor) {
  const watched = InheritancePreserver.getModifiedConstructor<WatchedConstructor>(constructor);
  const watchers = watched[watchersSymbol];

  if (watchers) {
    // add action creators to static methods of the controller
    Object.keys(watchers).forEach(actionType => {
      const staticMethodName = extractMethodNameFromActionType(actionType, watched.name);
      watched[staticMethodName as unknown as keyof typeof watched] = (payload?: any) => createAction(actionType, payload);
    });

    let _watcher = watched[controllerWatcherSymbol];
    if (!_watcher) {
      const watchList = Object.keys(watchers).map(actionType => (
        [
          actionType,
          watchers[actionType],
        ] as [string, string]
      ));
      _watcher = watched[controllerWatcherSymbol] = watcher(watched, watchList);
      MetadataStorage.addImplicitWatcher(_watcher);
    }
  }

  return constructor;
}

function watchMethod(actionType?: string) {
  return function (prototype: Prototype, propertyKey: string) {
    let watched = InheritancePreserver.getModifiedConstructor<WatchedConstructor>(prototype.constructor);
    if (!watched) {
      watched = prototype.constructor;

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
