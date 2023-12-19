"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainActions = exports.FALLBACK_ACTION_TYPE = exports.FIRST_ACTION_IN_CHAIN_TYPE = void 0;
const index_js_1 = require("../types/index.js");
const createAction_js_1 = require("./createAction.js");
exports.FIRST_ACTION_IN_CHAIN_TYPE = 'Action chain start';
exports.FALLBACK_ACTION_TYPE = 'No actions were passed to chain function';
function chainActions(...actions) {
    const filteredActions = actions.filter((actionOrFactoryOrInvalid) => typeof actionOrFactoryOrInvalid === 'function' || (0, index_js_1.isAction)(actionOrFactoryOrInvalid));
    if (!filteredActions.length) {
        return (0, createAction_js_1.createAction)(exports.FALLBACK_ACTION_TYPE);
    }
    const [firstAction, ...restActions] = filteredActions;
    if ((0, index_js_1.isAction)(firstAction)) {
        return firstAction.addNextActions(...restActions);
    }
    const action = (0, createAction_js_1.createAction)(exports.FIRST_ACTION_IN_CHAIN_TYPE);
    action.addNextActions(...filteredActions);
    return action;
}
exports.chainActions = chainActions;
//# sourceMappingURL=chainActions.js.map