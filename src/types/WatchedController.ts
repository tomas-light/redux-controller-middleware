import { Action } from './Action';
import { Controller } from './Controller';

export type WatchedController<TController extends Controller> = {
	[methodName in keyof TController]: TController[methodName] extends (mayBeAction: infer MayBeAction) => any
		? MayBeAction extends Action<infer Payload>
			? Payload extends undefined
				? () => Action
				: (payload: Payload) => Action<Payload>
			: (...params: Parameters<TController[methodName]>) => Action
		: TController[methodName];
};
