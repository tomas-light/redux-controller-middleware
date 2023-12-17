"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callActionReducer = void 0;
const tryToFindDependencyContainer_js_1 = require("../controller/tryToFindDependencyContainer.js");
async function callActionReducer(parameters) {
    const { 
    //
    action, actionReducer, middlewareAPI, } = parameters;
    const container = (0, tryToFindDependencyContainer_js_1.tryToFindDependencyContainer)(action, parameters.container);
    if (typeof actionReducer === 'function') {
        try {
            await actionReducer({
                ...middlewareAPI,
                action,
                container,
            });
        }
        catch (error) {
            console.error('Unhandled exception in action reducer', error);
        }
        return;
    }
    for await (const [controllerConstructor, methodName] of actionReducer) {
        let controller;
        if (container) {
            controller = container.resolve(controllerConstructor);
        }
        else {
            controller = new controllerConstructor(middlewareAPI);
        }
        const reducer = controller[methodName];
        if (typeof reducer === 'function') {
            try {
                await reducer.call(controller, action);
            }
            catch (error) {
                console.error('Unhandled exception in controller', error);
            }
        }
    }
}
exports.callActionReducer = callActionReducer;
//# sourceMappingURL=callActionReducer.js.map