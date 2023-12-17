import { isActionWithContainer } from '../types/index.js';
export function tryToFindDependencyContainer(action, container) {
    let resolver = undefined;
    if (container) {
        if (typeof container === 'function') {
            resolver = container();
        }
        else {
            resolver = container;
        }
    }
    // scope container has higher priority
    if (isActionWithContainer(action)) {
        resolver = action.container;
    }
    return resolver;
}
//# sourceMappingURL=tryToFindDependencyContainer.js.map