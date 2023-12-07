import { methodNamesTemporaryBox } from '../constants.js';
import { Action } from '../types/index.js';

export interface ReducerDecorator {
  <This, TPayload, Args extends Action<TPayload>[], Return>(
    target: undefined, // is it always undefined for field decorators ?
    fieldContext: ClassFieldDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): void;

  <This, TPayload, Args extends Action<TPayload>[], Return>(
    method: (this: This, ...args: Args) => Return,
    methodContext: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): (this: This, ...args: Args) => Return;
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
