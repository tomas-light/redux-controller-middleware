import { isAction } from '../types/index.js';
import { createAction } from './createAction.js';
export const FIRST_ACTION_IN_CHAIN_TYPE = 'Action chain start';
export const FALLBACK_ACTION_TYPE = 'No actions were passed to chain function';
export function chainActions(...actions) {
    const filteredActions = actions.filter((actionOrFactoryOrInvalid) => typeof actionOrFactoryOrInvalid === 'function' || isAction(actionOrFactoryOrInvalid));
    if (!filteredActions.length) {
        return createAction(FALLBACK_ACTION_TYPE);
    }
    const [firstAction, ...restActions] = filteredActions;
    if (isAction(firstAction)) {
        return firstAction.addNextActions(...restActions);
    }
    const action = createAction(FIRST_ACTION_IN_CHAIN_TYPE);
    action.addNextActions(...filteredActions);
    return action;
}
//# sourceMappingURL=chainActions.js.map