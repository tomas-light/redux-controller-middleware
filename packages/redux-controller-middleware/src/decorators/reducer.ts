import { methodNamesTemporaryBox } from '../constants.js';
import type { Action } from '../types/index.js';

export interface ReducerMethodDecorator {
  // stage 3 decorator
  <This, TPayload, Args extends Action<TPayload>[], Return>(
    method: (this: This, ...args: Args) => Return,
    methodContext: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): (this: This, ...args: Args) => Return;

  // stage 2 decorator
  <This, TPayload, Args extends Action<TPayload>[], Return>(
    method: (this: This, ...args: Args) => Return,
    methodName: string,
    descriptor: PropertyDescriptor
  ): void;
}

export interface ReducerPropertyDecorator {
  // stage 3 decorator
  <This, TPayload, Args extends Action<TPayload>[], Return>(
    target: undefined, // is it always undefined for field decorators
    fieldContext: ClassFieldDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): void;

  // stage 2 decorator
  (classPrototype: any, propertyName: string): void;
}

export interface ReducerDecorator extends ReducerMethodDecorator, ReducerPropertyDecorator {}

/**
 * It marks your method as action handler, you have to use `@reduxController` decorator on the class as well,
 * to register this method in the middleware
 * */
export const reducer: ReducerDecorator = ((method: unknown, contextOrName: DecoratorContext | string) => {
  if (typeof contextOrName === 'string') {
    methodNamesTemporaryBox.push(contextOrName);
    return;
  }

  if (typeof contextOrName.name === 'symbol') {
    throw new Error('Cannot decorate symbol names.');
  }

  switch (contextOrName.kind) {
    case 'field':
    case 'method':
      methodNamesTemporaryBox.push(contextOrName.name);
      return method;

    case 'accessor':
    case 'class':
    case 'getter':
    case 'setter':
    default:
      throw new Error('Decorator can be used only for method and bounded methods (arrow function style)');
  }
}) as ReducerDecorator;
