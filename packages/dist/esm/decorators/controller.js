import { createAction } from '../actions/createAction.js';
import { actionToControllerMap, methodNamesTemporaryBox } from '../constants.js';
import { makeActionType } from '../actions/makeActionType.js';
/**
 * It registers your controller in the middleware. You need to add `@actionHandler` decorator to some of your methods
 * */
export const controller = ((saltOrConstructor, context) => {
    if (typeof saltOrConstructor === 'string') {
        return reduxFactoryClassDecorator(saltOrConstructor);
    }
    // to prevent names collisions, when you have two controllers with the same name
    const uniqueSalt = new Date().valueOf().toString();
    return reduxFactoryClassDecorator(uniqueSalt)(saltOrConstructor, context);
});
const reduxFactoryClassDecorator = ((uniqueSalt) => {
    return (constructor, context) => {
        const watchedMethodNames = getWatchedMethodNames();
        const controllerName = context?.name ?? constructor.name;
        watchedMethodNames.forEach((methodName) => {
            const actionType = makeActionType({
                controllerName,
                methodName,
                uniqueSalt,
            });
            registerControllerMethod({
                constructor,
                methodName,
                actionType,
            });
            addActionCreatorAsStaticMethod(constructor, actionType, methodName);
        });
        return constructor;
    };
});
function getWatchedMethodNames() {
    const watchedMethodNames = methodNamesTemporaryBox.slice();
    methodNamesTemporaryBox.splice(0, methodNamesTemporaryBox.length);
    return watchedMethodNames;
}
function registerControllerMethod(parameters) {
    const { constructor, actionType, methodName } = parameters;
    let actionControllers = actionToControllerMap.get(actionType);
    if (!actionControllers) {
        actionControllers = new Map();
        actionToControllerMap.set(actionType, actionControllers);
    }
    if (typeof actionControllers === 'function') {
        // action reducers have to has unique action type for them, so collisions with controllers should not happens
        throw new Error('There is already registered action reducer for this action type. Probably, it is a bug in redux-controller-middleware. Please report it to our Issues on Github.');
    }
    actionControllers.set(constructor, methodName);
}
function addActionCreatorAsStaticMethod(constructor, actionType, methodName) {
    const actionCreator = (payload) => createAction(actionType, payload);
    constructor[methodName] = actionCreator;
}
//# sourceMappingURL=controller.js.map