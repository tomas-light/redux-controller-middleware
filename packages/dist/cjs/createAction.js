"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAction = void 0;
const AppAction_js_1 = require("./AppAction.js");
function createAction(actionType, payload) {
    let normalizedPayload;
    if (typeof payload === 'object' && !Array.isArray(payload)) {
        normalizedPayload = { ...payload };
    }
    else {
        normalizedPayload = payload;
    }
    return new AppAction_js_1.AppAction(actionType, normalizedPayload).toPlainObject();
}
exports.createAction = createAction;
//# sourceMappingURL=createAction.js.map