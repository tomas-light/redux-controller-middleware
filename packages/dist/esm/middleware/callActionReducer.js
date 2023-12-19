import { tryToFindDependencyContainer } from '../tryToFindDependencyContainer.js';
export async function callActionReducer(parameters) {
    const { 
    //
    action, actionReducer, middlewareAPI, } = parameters;
    const container = tryToFindDependencyContainer(action, parameters.container);
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
//# sourceMappingURL=callActionReducer.js.map