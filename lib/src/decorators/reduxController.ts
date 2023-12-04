import { actionToControllerMap, methodNamesTemporaryBox } from '../constants';
import { createAction } from '../createAction';
import { Constructor, Controller, ControllerConstructor } from '../types';
import { makeActionType } from './makeActionType';

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
export const reduxController: ReduxControllerDecorator = ((saltOrConstructor, context) => {
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

  actionToControllerMap.set(actionType, {
    controllerConstructor: constructor,
    methodName,
  });
}

function addActionCreatorAsStaticMethod(constructor: Constructor, actionType: string, methodName: string) {
  const actionCreator = (payload?: any) => createAction(actionType, payload);
  constructor[methodName as keyof typeof constructor] = actionCreator as (typeof constructor)[keyof typeof constructor];
}
