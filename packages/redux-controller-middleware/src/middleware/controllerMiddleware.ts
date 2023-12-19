import { Container } from 'cheap-di';
import { Dispatch, Middleware as ReduxMiddleware, MiddlewareAPI } from 'redux';
import { actionToControllerMap } from '../constants.js';
import { dispatchNextActions } from '../decorators/dispatchNextActions.js';
import { Action, isAction } from '../types/index.js';
import { callActionReducer } from './callActionReducer.js';
import { Middleware } from './Middleware.js';

type ControllerMiddlewareOptions = {
  container?: Container | (() => Container);
};

function controllerMiddleware<State, _DispatchExt = {}>(
  options: ControllerMiddlewareOptions = {}
): ReduxMiddleware<_DispatchExt, State, Dispatch> {
  return (middlewareAPI) => {
    if (options?.container) {
      if (typeof options.container === 'function') {
        options.container().registerInstance(middlewareAPI).as(Middleware);
      } else {
        options.container.registerInstance(middlewareAPI).as(Middleware);
      }
    }

    return (next) => {
      return async (action) => {
        next(action);

        // we process only actions created with the redux-controller-middleware
        if (!isAction(action)) {
          return;
        }

        await handleAction({
          ...options,
          middlewareAPI,
          action,
        });
      };
    };
  };
}

async function handleAction<State>(
  params: ControllerMiddlewareOptions & {
    middlewareAPI: MiddlewareAPI<Dispatch, State>;
    action: Action<unknown>;
  }
) {
  const { container, middlewareAPI, action } = params;

  const actionReducer = actionToControllerMap.get(action.type);
  if (actionReducer) {
    await callActionReducer({
      middlewareAPI,
      container,
      actionReducer,
      action,
    });
  }

  if (action.stopPropagation) {
    action.executionCompleted?.();
    return;
  }

  await dispatchNextActions(middlewareAPI, action);

  action.executionCompleted?.();
}

export type { ControllerMiddlewareOptions };
export { controllerMiddleware };
