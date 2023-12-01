import { watcher } from '../controller';
import { createAction } from '../createAction';
import { MetadataStorage } from '../MetadataStorage';
import { controllerWatcherSymbol, watchersSymbol } from '../symbols';
import { ActionType, Constructor, Controller, ControllerConstructor, WatchedConstructor } from '../types';
import { extractMethodNameFromActionType } from './extractMethodNameFromActionType';
import { InheritancePreserver } from './InheritancePreserver';
import { makeActionType } from './makeActionType';

// constructor
function watch<TController extends Controller, TConstructor extends ControllerConstructor<TController>>(
  constructor: TConstructor,
  context: ClassDecoratorContext
): TConstructor;
// method factory
function watch(
  actionType: string
): <This, Args extends any[], Return>(
  method: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) => typeof method;
// method
function watch<This, Args extends any[], Return>(
  method: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
): typeof method;

function watch(constructorOrMethodOrActionType?: any, context?: ClassDecoratorContext | ClassMethodDecoratorContext) {
  if (arguments.length === 1 && typeof constructorOrMethodOrActionType === 'string') {
    return watchMethod(constructorOrMethodOrActionType);
  }

  if (context?.kind === 'class') {
    return watchConstructor(constructorOrMethodOrActionType as Constructor, context);
  }

  if (context?.kind === 'method') {
    return watchMethod()(constructorOrMethodOrActionType, context);
  }

  // eslint-disable-next-line prefer-rest-params
  console.warn('here is a mistake in decorator call. Arguments:', ...arguments);
  return constructorOrMethodOrActionType;
}

function watchConstructor<TController extends Controller, TConstructor extends ControllerConstructor<TController>>(
  constructor: TConstructor,
  context: ClassDecoratorContext
): TConstructor {
  context.addInitializer(function () {
    try {
      // trigger all method initializers
      // it is a bad approach, but `metadata` is not implemented yet
      // when it will be implemented at least in ts-jest, we can use it instead of fake instantiating
      new constructor(null as any);
    } catch (error) {
      console.warn(
        "We can't register your controller, because there is an error in its constructor, when we are trying to initialize it without any arguments. Please handle his case for yourself. It is temporal decision, while metadata is not implemented correctly for decorators"
      );
      throw error;
    }
  });

  return constructor;
}

function watchMethod(actionType?: ActionType) {
  return function <This, Args extends any[], Return>(
    method: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): typeof method {
    if (typeof context.name === 'symbol') {
      throw new Error('Cannot decorate symbol names.');
    }

    context.addInitializer(function () {
      const constructor = (this as any).constructor as Constructor;
      const methodName = context.name as string;

      if (!actionType) {
        actionType = methodName;
      }
      actionType = makeActionType(constructor.name, actionType);

      let watchedConstructor = InheritancePreserver.getModifiedConstructor<WatchedConstructor>(constructor);
      if (!watchedConstructor) {
        watchedConstructor = constructor as WatchedConstructor;

        if (!watchedConstructor[watchersSymbol]) {
          watchedConstructor[watchersSymbol] = {};
        }
      }

      // add mapping between action type and method name
      const watchers = watchedConstructor[watchersSymbol] as Record<ActionType, string>;
      if (watchers && !watchers[actionType]) {
        watchers[actionType] = methodName;
      }
      InheritancePreserver.constructorModified(watchedConstructor ?? constructor);

      let controllerWatcher = watchedConstructor[controllerWatcherSymbol];
      if (!controllerWatcher) {
        watchedConstructor[controllerWatcherSymbol] = watcher(
          watchedConstructor,
          watchers as Record<ActionType, never>
        );
        controllerWatcher = watchedConstructor[controllerWatcherSymbol];
        MetadataStorage.addImplicitWatcher(controllerWatcher);
      }

      // add action creators to static methods of the controller
      const staticMethodName = extractMethodNameFromActionType(actionType, watchedConstructor.name) as string;
      watchedConstructor[staticMethodName] = (payload?: any) => createAction(actionType!, payload);
    });

    return method;
  };
}

export { watch };
