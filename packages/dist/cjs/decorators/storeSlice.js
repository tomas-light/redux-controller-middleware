"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreSliceUpdateActionType = exports.isDecoratedStoreSlice = exports.storeSlice = void 0;
const createStoreSliceReducer_js_1 = require("../createStoreSliceReducer.js");
const makeActionType_js_1 = require("./makeActionType.js");
exports.storeSlice = ((constructor) => {
    const sanitizedClassName = constructor.name.replaceAll('StoreSlice', '').replaceAll('Store', '');
    const decoratedStoreSlice = constructor;
    const initialValues = new constructor();
    // redux checks value prototypes, if direct prototype is no Object, it writes warning in console,
    const plainInitialValues = { ...initialValues };
    decoratedStoreSlice.update = (0, makeActionType_js_1.makeActionType)({
        controllerName: sanitizedClassName,
        methodName: 'updateStore',
    });
    decoratedStoreSlice.reducer = (0, createStoreSliceReducer_js_1.createStoreSliceReducer)(plainInitialValues, decoratedStoreSlice.update);
    return decoratedStoreSlice;
});
function isDecoratedStoreSlice(storeSliceConstructor) {
    if (!storeSliceConstructor) {
        return false;
    }
    if (typeof storeSliceConstructor !== 'function') {
        return false;
    }
    return (('update') in storeSliceConstructor &&
        ('reducer') in storeSliceConstructor);
}
exports.isDecoratedStoreSlice = isDecoratedStoreSlice;
/**
 * returns action type of store slice updating action, if passed slice is decorated with @storeSlice
 * @example
 * import { getStoreSliceUpdateActionType, storeSlice, updateStoreSlice } from 'redux-controller-middleware';
 *
 * \@storeSlice
 * class MySlice {
 *   ...
 * }
 *
 * const updateAction = updateStoreSlice(MySlice);
 * const updateActionType = getStoreSliceUpdateActionType(MySlice);
 *
 * updateActionType === updateAction.type // true
 * */
function getStoreSliceUpdateActionType(storeSliceConstructor) {
    return (isDecoratedStoreSlice(storeSliceConstructor) && storeSliceConstructor.update) || '';
}
exports.getStoreSliceUpdateActionType = getStoreSliceUpdateActionType;
//# sourceMappingURL=storeSlice.js.map