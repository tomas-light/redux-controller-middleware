import { actionPromises } from '../actionPromises.js';
import { actionToControllerMap } from '../constants.js';
import { dispatchNextActions } from '../actions/dispatchNextActions.js';
import { isAction } from '../types/index.js';
import { callActionReducer } from './callActionReducer.js';
import { Middleware } from './Middleware.js';
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
        actionPromises.resolveAll(action);
        return;
    }
    await dispatchNextActions(middlewareAPI, action);
    actionPromises.resolveAll(action);
}
export { controllerMiddleware };
//# sourceMappingURL=controllerMiddleware.js.map