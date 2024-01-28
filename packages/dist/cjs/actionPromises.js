"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPromises = void 0;
exports.actionPromises = {
    map: new Map(),
    add: (action) => {
        let resolvers = exports.actionPromises.map.get(action.type);
        if (!resolvers) {
            resolvers = [];
            exports.actionPromises.map.set(action.type, resolvers);
        }
        return new Promise((resolve) => {
            resolvers?.push(resolve);
        });
    },
    resolveAll: (action) => {
        const resolvers = exports.actionPromises.map.get(action.type);
        resolvers?.forEach((resolvePromise) => {
            resolvePromise();
        });
        exports.actionPromises.map.delete(action.type);
    },
};
//# sourceMappingURL=actionPromises.js.map