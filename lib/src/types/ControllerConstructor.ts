import { Middleware } from '../Middleware';
import { Controller } from './Controller';

export interface ControllerConstructor<State extends {} = {}> {
	new (middlewareAPI: Middleware, ...args: any[]): Controller<State>;
}

export type InferConstructorResult<TConstructor> = TConstructor extends ControllerConstructor
	? TConstructor extends new (middlewareAPI: Middleware, ...args: any[]) => infer Result
		? Result
		: never
	: never;
