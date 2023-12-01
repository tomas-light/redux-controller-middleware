import { Container } from 'cheap-di';
import { Dispatch, MiddlewareAPI } from 'redux';
import { Controller, Watcher } from '../types';

type ControllerFactory = (watcher: Watcher) => Controller;

function makeControllerFactory<State>(
  middlewareAPI: MiddlewareAPI<Dispatch, State>,
  container: Container | undefined
): ControllerFactory {
  if (!container) {
    return (watcher) => new watcher.type(middlewareAPI);
  }

  return (watcher) => {
    return container.resolve(watcher.type) as Controller;
  };
}

export { makeControllerFactory };
