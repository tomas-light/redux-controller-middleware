import { DependencyResolver } from 'cheap-di';
import { Action, isActionWithContainer } from './types/index.js';

export function tryToFindDependencyContainer<Payload = undefined>(
  action: Action<Payload>,
  container?: DependencyResolver | (() => DependencyResolver)
) {
  let resolver: DependencyResolver | undefined = undefined;
  if (container) {
    if (typeof container === 'function') {
      resolver = container();
    } else {
      resolver = container;
    }
  }

  // scope container has higher priority
  if (isActionWithContainer(action)) {
    resolver = action.container;
  }

  return resolver;
}
