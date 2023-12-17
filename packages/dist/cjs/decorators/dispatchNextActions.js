"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchNextActions = void 0;
const AppAction_js_1 = require("../AppAction.js");
const index_js_1 = require("../types/index.js");
async function dispatchNextActions(middlewareAPI, action) {
    const nextActions = [...AppAction_js_1.AppAction.getActions(action)];
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
        if (!(0, index_js_1.isAction)(nextAction)) {
            // if it was just callback, no need additional processing
            continue;
        }
        await new Promise((resolve) => {
            nextAction.executionCompleted = resolve;
            middlewareAPI.dispatch(nextAction);
        });
        if (nextAction.stopPropagation) {
            break;
        }
    }
}
exports.dispatchNextActions = dispatchNextActions;
//# sourceMappingURL=dispatchNextActions.js.map