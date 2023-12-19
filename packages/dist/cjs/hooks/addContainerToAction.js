"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContainerToAction = void 0;
const index_js_1 = require("../actions/index.js");
function addContainerToAction(action, diContext) {
    if (!diContext.container) {
        return action;
    }
    if (action instanceof index_js_1.AppAction) {
        action.container = diContext.container;
        return action;
    }
    const newAction = (0, index_js_1.createAction)(action.type, {});
    for (const [key, value] of Object.entries(action)) {
        if (key !== ('type')) {
            newAction.payload[key] = value;
        }
    }
    return newAction;
}
exports.addContainerToAction = addContainerToAction;
//# sourceMappingURL=addContainerToAction.js.map