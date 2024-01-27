export const actionPromises = {
    map: new Map(),
    add: (action) => {
        let resolvers = actionPromises.map.get(action.type);
        if (!resolvers) {
            resolvers = [];
            actionPromises.map.set(action.type, resolvers);
        }
        return new Promise((resolve) => {
            resolvers?.push(resolve);
        });
    },
    resolveAll: (action) => {
        const resolvers = actionPromises.map.get(action.type);
        resolvers?.forEach((resolvePromise) => {
            resolvePromise();
        });
        actionPromises.map.delete(action.type);
    },
};
//# sourceMappingURL=actionPromises.js.map