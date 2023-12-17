"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAction = void 0;
function isAction(action) {
    return (action &&
        typeof action === 'object' &&
        'payload' in action &&
        'actions' in action &&
        'stopPropagation' in action &&
        typeof action.stop === 'function' &&
        typeof action.getActions === 'function');
}
exports.isAction = isAction;
//# sourceMappingURL=isAction.js.map