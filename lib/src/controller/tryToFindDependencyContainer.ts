import { Container } from 'cheap-di';
import { ActionMaybeWithContainer } from '../types/index.js';

function tryToFindDependencyContainer(action: ActionMaybeWithContainer, getContainer?: () => Container) {
  let container: Container | undefined = undefined;
  if (typeof getContainer === 'function') {
    container = getContainer();
  }

  // scope container has higher priority
  if (action.container) {
    container = action.container;
  }

  return container;
}

export { tryToFindDependencyContainer };
