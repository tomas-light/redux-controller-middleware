"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActionWithContainer = void 0;
function isActionWithContainer(action) {
    return ('container') in action && action.container != null;
}
exports.isActionWithContainer = isActionWithContainer;
//# sourceMappingURL=ActionMaybeWithContainer.js.map