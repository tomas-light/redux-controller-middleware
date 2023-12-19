"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReducer = void 0;
const index_js_1 = require("./actions/index.js");
const constants_js_1 = require("./constants.js");
const makeActionType_js_1 = require("./decorators/makeActionType.js");
function createReducer(actionName, reducer) {
    const actionType = (0, makeActionType_js_1.makeActionType)({
        methodName: actionName,
        uniqueSalt: new Date().valueOf().toString(),
    });
    constants_js_1.actionToControllerMap.set(actionType, reducer);
    return ((payload) => (0, index_js_1.createAction)(actionType, payload));
}
exports.createReducer = createReducer;
//# sourceMappingURL=createReducer.js.map