import { actionToControllerMap } from './constants.js';
import { createAction } from './createAction.js';
import { makeActionType } from './decorators/makeActionType.js';
export function createReducer(actionName, reducer) {
    const actionType = makeActionType({
        methodName: actionName,
        uniqueSalt: new Date().valueOf().toString(),
    });
    actionToControllerMap.set(actionType, reducer);
    return ((payload) => createAction(actionType, payload));
}
//# sourceMappingURL=createReducer.js.map