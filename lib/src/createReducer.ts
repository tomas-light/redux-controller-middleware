import { ActionReducerParameters, actionToControllerMap } from './constants';
import { createAction } from './createAction';
import { makeActionType } from './decorators/makeActionType';
import { Action } from './types';

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
