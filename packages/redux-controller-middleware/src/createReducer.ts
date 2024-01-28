import { createAction } from './actions/index.js';
import { actionToControllerMap } from './constants.js';
import { makeActionType } from './actions/makeActionType.js';
import type { Action, ActionReducerParameters } from './types/index.js';

type InferActionFactory<Payload> = Payload extends undefined ? () => Action : (payload: Payload) => Action<Payload>;

export function createReducer<Payload = undefined, State = unknown>(
  actionName: string,
  reducer: (parameters: ActionReducerParameters<Payload, State>) => any
): InferActionFactory<Payload> {
  const actionType = makeActionType({
    methodName: actionName,
    uniqueSalt: new Date().valueOf().toString(),
  });

  actionToControllerMap.set(actionType, reducer);

  return ((payload: unknown) => createAction(actionType, payload)) as InferActionFactory<Payload>;
}
