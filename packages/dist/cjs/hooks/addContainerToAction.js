"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContainerToAction = void 0;
const AppAction_js_1 = require("../AppAction.js");
const createAction_js_1 = require("../createAction.js");
function addContainerToAction(action, diContext) {
    if (!diContext.container) {
        return action;
    }
    if (action instanceof AppAction_js_1.AppAction) {
        action.container = diContext.container;
        return action;
    }
    const newAction = (0, createAction_js_1.createAction)(action.type, {});
    for (const [key, value] of Object.entries(action)) {
        if (key !== ('type')) {
            newAction.payload[key] = value;
        }
    }
    return newAction;
}
exports.addContainerToAction = addContainerToAction;
//# sourceMappingURL=addContainerToAction.js.map