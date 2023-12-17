import { actionToControllerMap } from '../constants.js';
import { callActionReducer } from '../decorators/callActionReducer.js';
import { dispatchNextActions } from '../decorators/dispatchNextActions.js';
import { Middleware } from '../Middleware.js';
import { isAction } from '../types/index.js';
function controllerMiddleware(options = {}) {
    return (middlewareAPI) => {
        if (options?.container) {
            if (typeof options.container === 'function') {
                options.container().registerInstance(middlewareAPI).as(Middleware);
            }
            else {
                options.container.registerInstance(middlewareAPI).as(Middleware);
            }
        }
        return (next) => {
            return async (action) => {
                next(action);
                // we process only actions created with the redux-controller-middleware
                if (!isAction(action)) {
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
async function handleAction(params) {
    const { container, middlewareAPI, action } = params;
    const actionReducer = actionToControllerMap.get(action.type);
    if (actionReducer) {
        await callActionReducer({
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
    await dispatchNextActions(middlewareAPI, action);
    action.executionCompleted?.();
}
export { controllerMiddleware };
//# sourceMappingURL=controllerMiddleware.js.map