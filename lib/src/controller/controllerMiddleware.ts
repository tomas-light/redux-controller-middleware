import { Container } from 'cheap-di';
import { Dispatch, Middleware as ReduxMiddleware, MiddlewareAPI } from 'redux';
import { AppAction } from '../AppAction';
import { MetadataStorage } from '../MetadataStorage';
import { Middleware } from '../Middleware';
import { Action, ActionMaybeWithContainer, isAction, Watcher } from '../types';
import { makeControllerFactory } from './makeControllerFactory';
import { tryToFindDependencyContainer } from './tryToFindDependencyContainer';

type MiddlewareOptions = {
  watchers?: Watcher[];
  getContainer?: () => Container;
};

function controllerMiddleware<State>(options: MiddlewareOptions = {}): ReduxMiddleware<Dispatch, State> {
  return (middlewareAPI: MiddlewareAPI<Dispatch, State>) => {
    return (next: (action: ActionMaybeWithContainer) => void) => {
      return async (action: ActionMaybeWithContainer) => {
        await handleAction({
          ...options,
          middlewareAPI,
          action,
          next,
        });
      };
    };
  };
}

async function handleAction<State>(
  params: MiddlewareOptions & {
    middlewareAPI: MiddlewareAPI<Dispatch, State>;
    next: (action: ActionMaybeWithContainer) => void;
    action: ActionMaybeWithContainer;
  }
) {
  const { watchers = [], getContainer, middlewareAPI, action, next } = params;

  // we process only actions created with the redux-controller-middleware
  if (!isAction(action)) {
    next(action);
    return;
  }

  const container = tryToFindDependencyContainer(action, getContainer);
  if (container) {
    container.registerInstance(middlewareAPI).as(Middleware);
  }

  const controllerFactory = makeControllerFactory(middlewareAPI, container);
  const implicitWatchers = MetadataStorage.getImplicitWatchers();
  const allWatchers = watchers.concat(implicitWatchers);

  for await (const watcher of allWatchers) {
    const actionName = watcher.get(action.type);
    if (!actionName) {
      continue;
    }

    const controller = controllerFactory(watcher);
    const actionHandler = controller[actionName as keyof typeof controller];
    if (typeof actionHandler === 'function') {
      try {
        await (actionHandler as (action: Action) => any).call(controller, action);
      } catch (error) {
        console.error('Unhandled exception in controller', error);
        // if there is something went wrong, we cannot proceed as normal,
        // because some user flow may be broken
        break;
      }
    }
  }

  next(action);

  if (action.stopPropagation) {
    action.handled?.();
    return;
  }

  const nextActions = [...AppAction.getActions(action)];

  while (nextActions.length) {
    const nextActionOrFactory = nextActions.shift();
    let nextAction: Action | void;

    if (typeof nextActionOrFactory === 'function') {
      try {
        // callback or action factory
        nextAction = await nextActionOrFactory();
      } catch (error) {
        console.error('Unhandled exception in callback or action factory', error);
        // if there is something went wrong, we cannot proceed as normal,
        // because some user flow may be broken
        break;
      }
    } else {
      nextAction = nextActionOrFactory;
    }

    if (!isAction(nextAction)) {
      // if it was just callback, no need additional processing
      continue;
    }

    await new Promise<void>((resolve) => {
      (nextAction as Action).handled = resolve;
      middlewareAPI.dispatch(nextAction as Action);
    });

    if (nextAction.stopPropagation) {
      break;
    }
  }

  action.handled?.();
}

export type { MiddlewareOptions };
export { controllerMiddleware };
