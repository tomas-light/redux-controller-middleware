import { Container } from 'cheap-di';
import { Dispatch, Middleware as ReduxMiddleware, MiddlewareAPI } from 'redux';
import { actionToControllerMap } from '../constants.js';
import { callActionReducer } from '../decorators/callActionReducer.js';
import { dispatchNextActions } from '../decorators/dispatchNextActions.js';
import { Middleware } from '../Middleware.js';
import { ActionMaybeWithContainer, isAction } from '../types/index.js';
import { tryToFindDependencyContainer } from './tryToFindDependencyContainer.js';

type MiddlewareOptions = {
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
  const { getContainer, middlewareAPI, action, next } = params;

  // we process only actions created with the redux-controller-middleware
  if (!isAction(action)) {
    next(action);
    return;
  }

  const container = tryToFindDependencyContainer(action, getContainer);
  if (container) {
    container.registerInstance(middlewareAPI).as(Middleware);
  }

  const actionReducer = actionToControllerMap.get(action.type);
  if (actionReducer) {
    await callActionReducer({
      middlewareAPI,
      container,
      actionReducer,
      action,
    });
  }

  next(action);

  if (action.stopPropagation) {
    action.handled?.();
    return;
  }

  await dispatchNextActions(middlewareAPI, action);

  action.handled?.();
}

export type { MiddlewareOptions };
export { controllerMiddleware };
