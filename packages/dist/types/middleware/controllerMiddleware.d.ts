import { Container } from 'cheap-di';
import { Dispatch, Middleware as ReduxMiddleware } from 'redux';
type ControllerMiddlewareOptions = {
    container?: Container | (() => Container);
};
declare function controllerMiddleware<State, _DispatchExt = {}>(options?: ControllerMiddlewareOptions): ReduxMiddleware<_DispatchExt, State, Dispatch>;
export type { ControllerMiddlewareOptions };
export { controllerMiddleware };
