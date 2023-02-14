import { Action } from './Action';
import { Controller } from './Controller';

export type WatchedController<
	TController extends Controller,
	ReplaceActionNames extends {
		[methodName in keyof TController]?: string;
	} = {}
> = {
	[methodName in keyof TController as ReplaceActionNames[methodName] extends infer replacedName
		? replacedName extends string
			? replacedName
			: methodName
		: methodName]: TController[methodName] extends (mayBeAction: infer MayBeAction) => any
		? MayBeAction extends Action<infer Payload>
			? Payload extends undefined
				? () => Action
				: (payload: Payload) => Action<Payload>
			: (...params: Parameters<TController[methodName]>) => Action
		: TController[methodName];
};
