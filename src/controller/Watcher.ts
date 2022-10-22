import { Dispatch, MiddlewareAPI } from 'redux';

import { Controller } from '../types';
import { ControllerBase } from './ControllerBase';

type Watcher<State, TController extends Controller> = {
	has: (actionType: string) => boolean;
	get: (actionType: string) => keyof TController | undefined;
	instance: (middlewareAPI: MiddlewareAPI<Dispatch, State>) => ControllerBase<State>;
	type: new (middlewareAPI: MiddlewareAPI<Dispatch, State>, ...args: any[]) => ControllerBase<State>;
};

function watcher<State, TController extends Controller>(
	Controller: new (middlewareAPI: MiddlewareAPI<Dispatch, State>, ...args: any[]) => ControllerBase<State>,
	watchList: [string, keyof TController][]
): Watcher<State, TController> {
	const map = new Map<string, keyof TController>(watchList);

	return {
		has: (actionType: string) => map.has(actionType),
		get: (actionType: string) => map.get(actionType),
		instance: (middlewareAPI: MiddlewareAPI<Dispatch, State>) => new Controller(middlewareAPI),
		type: Controller,
	};
}

export { watcher };
export type { Watcher };
