"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreSliceReducer = void 0;
function createStoreSliceReducer(initialStore, updateActionType) {
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
exports.createStoreSliceReducer = createStoreSliceReducer;
//# sourceMappingURL=createStoreSliceReducer.js.map