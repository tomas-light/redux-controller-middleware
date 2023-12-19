export function createStoreSliceReducer(initialStore, updateActionType) {
    const storeSliceReducer = (store = initialStore, action) => {
        if (action.type !== updateActionType) {
            return store;
        }
        const { executionCompleted } = action;
        if (executionCompleted) {
            // timer because we can't predict, when redux applies changes
            setTimeout(() => {
                executionCompleted();
            });
        }
        if (typeof action.payload === 'object') {
            return {
                ...store,
                ...action.payload,
            };
        }
        return {
            ...store,
        };
    };
    return storeSliceReducer;
}
//# sourceMappingURL=createStoreSliceReducer.js.map