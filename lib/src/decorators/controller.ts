import { actionToControllerMap, methodNamesTemporaryBox } from '../constants';
import { createAction } from '../createAction.js';
import { Constructor, Controller, ControllerConstructor } from '../types/index.js';
import { makeActionType } from './makeActionType.js';

export interface Class_ReduxControllerDecorator {
  <TController extends Controller, TConstructor extends ControllerConstructor<TController>>(
    constructor: TConstructor,
    context: ClassDecoratorContext
  ): TConstructor;
}
export interface ClassFactory_ReduxControllerDecorator {
  /**
   * @param nameSalt {string} is used to add unique salt to action name to avoid collisions, if you have a few controllers with the same name and method names.
   * But if this is your intention, you may pass empty string to disable salt adding to the controller
   * */
  (nameSalt: string): Class_ReduxControllerDecorator;
}

export interface ReduxControllerDecorator
  extends Class_ReduxControllerDecorator,
    ClassFactory_ReduxControllerDecorator {}

/**
 * It registers your controller in the middleware. You need to add `@actionHandler` decorator to some of your methods
 * */
export const controller: ReduxControllerDecorator = ((saltOrConstructor, context) => {
  if (typeof saltOrConstructor === 'string') {
    return reduxFactoryClassDecorator(saltOrConstructor);
  }

  // to prevent names collisions, when you have two controllers with the same name
  const uniqueSalt = new Date().valueOf().toString();
  return reduxFactoryClassDecorator(uniqueSalt)(saltOrConstructor, context);
}) as ReduxControllerDecorator;

const reduxFactoryClassDecorator: ClassFactory_ReduxControllerDecorator = (uniqueSalt) => {
  return (constructor, context) => {
    const watchedMethodNames = getWatchedMethodNames(context);
    const controllerName = context.name;

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
};

// todo: use context.metadata for passing method names from method-decorator, when it will be ready
function getWatchedMethodNames(context: ClassDecoratorContext) {
  const watchedMethodNames = methodNamesTemporaryBox.slice();
  methodNamesTemporaryBox.splice(0, methodNamesTemporaryBox.length);

  return watchedMethodNames;
}

function registerControllerMethod(parameters: { constructor: Constructor; methodName: string; actionType: string }) {
  const { constructor, actionType, methodName } = parameters;

  let actionControllers = actionToControllerMap.get(actionType);
  if (!actionControllers) {
    actionControllers = new Map();
    actionToControllerMap.set(actionType, actionControllers);
  }

  if (typeof actionControllers === 'function') {
    // action reducers have to has unique action type for them, so collisions with controllers should not happens
    throw new Error(
      'There is already registered action reducer for this action type. Probably, it is a bug in redux-controller-middleware. Please report it to our Issues on Github.'
    );
  }

  actionControllers.set(constructor, methodName);
}

function addActionCreatorAsStaticMethod(constructor: Constructor, actionType: string, methodName: string) {
  const actionCreator = (payload?: any) => createAction(actionType, payload);
  constructor[methodName as keyof typeof constructor] = actionCreator as (typeof constructor)[keyof typeof constructor];
}
