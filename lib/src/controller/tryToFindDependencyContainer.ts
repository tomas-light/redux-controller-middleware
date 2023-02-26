import { Container, IHaveDependencies } from 'cheap-di';
import { ActionMaybeWithContainer } from '../types';

function tryToFindDependencyContainer(
	action: ActionMaybeWithContainer,
	getContainer?: () => Container & IHaveDependencies
) {
	let container: (Container & IHaveDependencies) | undefined = undefined;
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
