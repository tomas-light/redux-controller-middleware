"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDecoratedStoreSlice = exports.storeSlice = void 0;
const createStoreSliceReducer_js_1 = require("../createStoreSliceReducer.js");
const makeActionType_js_1 = require("./makeActionType.js");
exports.storeSlice = ((constructor) => {
    const sanitizedClassName = constructor.name.replaceAll('StoreSlice', '').replaceAll('Store', '');
    const decoratedStoreSlice = constructor;
    const initialValues = new constructor();
    decoratedStoreSlice.update = (0, makeActionType_js_1.makeActionType)({
        controllerName: sanitizedClassName,
        methodName: 'updateStore',
    });
    decoratedStoreSlice.reducer = (0, createStoreSliceReducer_js_1.createStoreSliceReducer)(initialValues, decoratedStoreSlice.update);
    return decoratedStoreSlice;
});
function isDecoratedStoreSlice(storeSlice) {
    if (!storeSlice) {
        return false;
    }
    if (typeof storeSlice !== 'function') {
        return false;
    }
    return (('update') in storeSlice &&
        ('reducer') in storeSlice);
}
exports.isDecoratedStoreSlice = isDecoratedStoreSlice;
//# sourceMappingURL=storeSlice.js.map