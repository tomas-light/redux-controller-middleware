import { actionPromises } from './actionPromises.js';
export function createStoreSliceReducer(initialStore, updateActionType) {
    const storeSliceReducer = (store = initialStore, action) => {
        if (action.type !== updateActionType) {
            return store;
        }
        // timer because we can't predict, when redux applies changes
        setTimeout(() => {
            actionPromises.resolveAll(action);
        });
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