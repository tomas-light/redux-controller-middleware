"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryToFindDependencyContainer = void 0;
const index_js_1 = require("./types/index.js");
function tryToFindDependencyContainer(action, container) {
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
    if ((0, index_js_1.isActionWithContainer)(action)) {
        resolver = action.container;
    }
    return resolver;
}
exports.tryToFindDependencyContainer = tryToFindDependencyContainer;
//# sourceMappingURL=tryToFindDependencyContainer.js.map