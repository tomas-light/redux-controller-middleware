"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerMiddleware = void 0;
const constants_js_1 = require("../constants.js");
const callActionReducer_js_1 = require("../decorators/callActionReducer.js");
const dispatchNextActions_js_1 = require("../decorators/dispatchNextActions.js");
const Middleware_js_1 = require("../Middleware.js");
const index_js_1 = require("../types/index.js");
function controllerMiddleware(options = {}) {
    return (middlewareAPI) => {
        if (options?.container) {
            if (typeof options.container === 'function') {
                options.container().registerInstance(middlewareAPI).as(Middleware_js_1.Middleware);
            }
            else {
                options.container.registerInstance(middlewareAPI).as(Middleware_js_1.Middleware);
            }
        }
        return (next) => {
            return async (action) => {
                next(action);
                // we process only actions created with the redux-controller-middleware
                if (!(0, index_js_1.isAction)(action)) {
                    return;
                }
                await handleAction({
                    ...options,
                    middlewareAPI,
                    action,
                });
            };
        };
    };
}
exports.controllerMiddleware = controllerMiddleware;
async function handleAction(params) {
    const { container, middlewareAPI, action } = params;
    const actionReducer = constants_js_1.actionToControllerMap.get(action.type);
    if (actionReducer) {
        await (0, callActionReducer_js_1.callActionReducer)({
            middlewareAPI,
            container,
            actionReducer,
            action,
        });
    }
    if (action.stopPropagation) {
        action.executionCompleted?.();
        return;
    }
    await (0, dispatchNextActions_js_1.dispatchNextActions)(middlewareAPI, action);
    action.executionCompleted?.();
}
//# sourceMappingURL=controllerMiddleware.js.map