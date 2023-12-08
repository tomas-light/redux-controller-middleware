import { Action as ReduxAction } from 'redux';
import { DiContextType } from 'cheap-di-react';
import { AppAction } from '../AppAction.js';
import { createAction } from '../createAction.js';

function addContainerToAction(action: ReduxAction, diContext: DiContextType) {
  if (!diContext.container) {
    return action;
  }

  if (action instanceof AppAction) {
    action.container = diContext.container;
    return action;
  }

  const newAction = createAction<Record<string, unknown>>(action.type, {});

  for (const [key, value] of Object.entries(action)) {
    if (key !== ('type' satisfies keyof typeof action)) {
      newAction.payload![key] = value;
    }
  }

  return newAction;
}

export { addContainerToAction };
