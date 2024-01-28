import type { Action } from '../types/index.js';
export interface ReducerMethodDecorator {
    <This, TPayload, Args extends Action<TPayload>[], Return>(method: (this: This, ...args: Args) => Return, methodContext: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>): (this: This, ...args: Args) => Return;
    <This, TPayload, Args extends Action<TPayload>[], Return>(method: (this: This, ...args: Args) => Return, methodName: string, descriptor: PropertyDescriptor): void;
}
export interface ReducerPropertyDecorator {
    <This, TPayload, Args extends Action<TPayload>[], Return>(target: undefined, // is it always undefined for field decorators
    fieldContext: ClassFieldDecoratorContext<This, (this: This, ...args: Args) => Return>): void;
    (classPrototype: any, propertyName: string): void;
}
export interface ReducerDecorator extends ReducerMethodDecorator, ReducerPropertyDecorator {
}
/**
 * It marks your method as action handler, you have to use `@reduxController` decorator on the class as well,
 * to register this method in the middleware
 * */
export declare const reducer: ReducerDecorator;
