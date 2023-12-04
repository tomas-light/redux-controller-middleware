import { methodNamesTemporaryBox } from '../constants';
import { Action } from '../types';

export interface ReducerDecorator {
  <TPayload, TContext extends ClassFieldDecoratorContext>(
    arrowFunction: undefined | ((action?: Action<TPayload>) => any),
    fieldContext: TContext
  ): void;

  <TPayload, TMethod extends (action?: Action<TPayload>) => any, TContext extends ClassMethodDecoratorContext>(
    method: TMethod,
    methodContext: TContext
  ): TMethod;
}

/**
 * It marks your method as action handler, you have to use `@reduxController` decorator on the class as well,
 * to register this method in the middleware
 * */
export const reducer: ReducerDecorator = ((method: unknown, context: DecoratorContext) => {
  if (typeof context.name === 'symbol') {
    throw new Error('Cannot decorate symbol names.');
  }

  switch (context.kind) {
    case 'field':
    case 'method':
      methodNamesTemporaryBox.push(context.name);
      return method;

    case 'accessor':
    case 'class':
    case 'getter':
    case 'setter':
    default:
      throw new Error('Decorator can be used only for method and bounded methods (arrow function style)');
  }
}) as ReducerDecorator;
