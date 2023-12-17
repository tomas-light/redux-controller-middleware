import { DependencyResolver } from 'cheap-di';
import { Action, isActionWithContainer } from '../types/index.js';

export function tryToFindDependencyContainer<Payload = undefined>(
  action: Action<Payload>,
  getContainer?: () => DependencyResolver
) {
  let container: DependencyResolver | undefined = undefined;
  if (typeof getContainer === 'function') {
    container = getContainer();
  }

  // scope container has higher priority
  if (isActionWithContainer(action)) {
    ({ container } = action);
  }

  return container;
}
