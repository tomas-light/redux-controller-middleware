export function createStoreSliceReducer(initialStore, updateActionType) {
    const storeSliceReducer = (store = initialStore, action) => {
        if (action.type !== updateActionType) {
            return store;
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