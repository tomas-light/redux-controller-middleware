import { Action } from './Action';
import { IsString } from './IsString';

export type ControllerWithCustomActionTypes<Watchers extends Record<string, any>> = {
	[actionType in IsString<keyof Watchers>]: Watchers[actionType] extends NonNullable<infer Payload>
		? (payload: Payload) => Action<Payload>
		: () => Action;
};
