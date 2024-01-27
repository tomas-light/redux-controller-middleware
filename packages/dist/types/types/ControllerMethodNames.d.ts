import type { Action } from './Action.js';
import type { ControllerConstructor, InferConstructorResult } from './ControllerConstructor.js';
import type { IsString } from './IsString.js';
export type ControllerMethodNames<TConstructor extends ControllerConstructor, TController = InferConstructorResult<TConstructor>, Step1 extends Record<string, any> = {
    [methodName in IsString<keyof TController>]: TController[methodName] extends (action?: Action<any>) => any ? true : never;
}, Step2 extends Record<string, any> = {
    [methodName in keyof Step1 as Step1[methodName] extends never ? never : methodName]: Step1[methodName];
}> = IsString<keyof Step2>;
