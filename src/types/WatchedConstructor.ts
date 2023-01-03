import { controllerWatcherSymbol, inheritancePreserveSymbol, watchersSymbol } from '../symbols';
import { ActionType } from './ActionType';
import { Constructor } from './Constructor';
import { Controller } from './Controller';
import { StaticActionsCreator } from './StaticActionsCreator';
import { Watcher } from './Watcher';

export type WatchedConstructor<TController extends Controller = Controller> = Constructor<TController> & {
	[inheritancePreserveSymbol]?: TController;
	[watchersSymbol]?: {
		[actionType: ActionType]: string; // callable method name
	};
	[controllerWatcherSymbol]?: Watcher;
} & StaticActionsCreator;
