import { ActionReducerParameters, actionToControllerMap } from './constants.js';
import { createAction } from './createAction.js';
import { makeActionType } from './decorators/makeActionType.js';
import { Action } from './types/index.js';

type InferActionFactory<Payload> = unknown extends Payload ? () => Action : (payload: Payload) => Action<Payload>;

export function createReducer<Payload>(
  actionName: string,
  reducer: (parameters: ActionReducerParameters<Payload>) => any
): InferActionFactory<Payload> {
  const actionType = makeActionType({
    methodName: actionName,
    uniqueSalt: new Date().valueOf().toString(),
  });

  actionToControllerMap.set(actionType, reducer);

  return ((payload: unknown) => createAction(actionType, payload)) as InferActionFactory<Payload>;
}
