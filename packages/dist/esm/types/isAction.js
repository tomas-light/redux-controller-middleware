export function isAction(action) {
    return (action &&
        typeof action === 'object' &&
        'payload' in action &&
        'actions' in action &&
        'stopPropagation' in action &&
        typeof action.stop === 'function' &&
        typeof action.getActions === 'function');
}
//# sourceMappingURL=isAction.js.map