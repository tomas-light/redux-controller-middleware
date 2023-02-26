import { Action, ControllerConstructor, InferConstructorResult, IsString } from './index';

export type ControllerMethodNames<
	TConstructor extends ControllerConstructor,
	TController = InferConstructorResult<TConstructor>,
	// check if values are action handler methods
	Step1 extends Record<string, any> = {
		[methodName in IsString<keyof TController>]: TController[methodName] extends (action?: Action<any>) => any
			? true
			: never;
	},
	// filter never values
	Step2 extends Record<string, any> = {
		[methodName in keyof Step1 as Step1[methodName] extends never ? never : methodName]: Step1[methodName];
	}
> = IsString<keyof Step2>;
