"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchNextActions = void 0;
const actionPromises_js_1 = require("../actionPromises.js");
const index_js_1 = require("../actions/index.js");
const index_js_2 = require("../types/index.js");
async function dispatchNextActions(middlewareAPI, action) {
    const nextActions = [...index_js_1.AppAction.getActions(action)];
    while (nextActions.length) {
        const nextActionOrFactory = nextActions.shift();
        let nextAction;
        if (typeof nextActionOrFactory === 'function') {
            try {
                // callback or action factory
                nextAction = await nextActionOrFactory();
            }
            catch (error) {
                console.error('Unhandled exception in callback or action factory', error);
                // if there is something went wrong, we cannot proceed as normal,
                // because some user flow may be broken
                break;
            }
        }
        else {
            nextAction = nextActionOrFactory;
        }
        if (!(0, index_js_2.isAction)(nextAction)) {
            // if it was just callback, no need additional processing
            continue;
        }
        const promise = actionPromises_js_1.actionPromises.add(nextAction);
        middlewareAPI.dispatch(nextAction);
        await promise;
        if (nextAction.stopPropagation) {
            break;
        }
    }
}
exports.dispatchNextActions = dispatchNextActions;
//# sourceMappingURL=dispatchNextActions.js.map