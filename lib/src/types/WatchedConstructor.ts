import { watchersSymbol } from '../symbols';
import { Constructor } from './Constructor';
import { Controller } from './Controller';
import { StaticActionsCreator } from './StaticActionsCreator';

export type WatchedConstructor<TController extends Controller = Controller> = Constructor<TController> & {
  [watchersSymbol]?: string[]; // callable method name
} & StaticActionsCreator;
