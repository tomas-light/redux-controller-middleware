"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitAction = void 0;
const actionPromises_js_1 = require("../actionPromises.js");
/**
 * it creates promise, that will be resolved, after action is processed by the middleware. If `dispatch` function is passed it will be called with passed action *
 * @example
 * const dispatch = useDispatch();
 *
 * // detailed using
 * const action = MyController.fetchUsers();
 * dispatch(action);
 * await waitAction(action);
 *
 * // same as above, short syntax
 * await waitAction(MyController.fetchUsers(), dispatch);
 * */
function waitAction(action, dispatch) {
    const promise = actionPromises_js_1.actionPromises.add(action);
    dispatch?.(action);
    return promise;
}
exports.waitAction = waitAction;
//# sourceMappingURL=waitAction.js.map