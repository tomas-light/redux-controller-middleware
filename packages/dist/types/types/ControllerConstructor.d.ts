import { Middleware } from '../middleware/Middleware.js';
import { Controller } from './Controller.js';
export interface ControllerConstructor<State extends {} = {}> {
    new (middlewareAPI: Middleware, ...args: any[]): Controller<State>;
}
export type InferConstructorResult<TConstructor> = TConstructor extends ControllerConstructor ? TConstructor extends new (middlewareAPI: Middleware, ...args: any[]) => infer Result ? Result : never : never;
