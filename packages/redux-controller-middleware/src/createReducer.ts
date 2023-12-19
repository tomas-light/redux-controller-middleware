import { createAction } from './actions/index.js';
import { actionToControllerMap } from './constants.js';
import { makeActionType } from './decorators/makeActionType.js';
import { Action, ActionReducerParameters } from './types/index.js';

type InferActionFactory<Payload> = undefined extends Payload ? () => Action : (payload: Payload) => Action<Payload>;

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
