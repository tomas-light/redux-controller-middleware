import { MiddlewareAPI } from 'redux';
import { AppAction } from '../AppAction.js';
import { Action, isAction } from '../types/index.js';

export async function dispatchNextActions(middlewareAPI: MiddlewareAPI, action: Action) {
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
}
