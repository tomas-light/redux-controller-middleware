"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreSliceReducer = void 0;
const actionPromises_js_1 = require("./actionPromises.js");
function createStoreSliceReducer(initialStore, updateActionType) {
    const storeSliceReducer = (store = initialStore, action) => {
        if (action.type !== updateActionType) {
            return store;
        }
        // timer because we can't predict, when redux applies changes
        setTimeout(() => {
            actionPromises_js_1.actionPromises.resolveAll(action);
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
exports.createStoreSliceReducer = createStoreSliceReducer;
//# sourceMappingURL=createStoreSliceReducer.js.map