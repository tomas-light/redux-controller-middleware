import { createStoreSliceReducer } from '../createStoreSliceReducer.js';
import { makeActionType } from '../actions/makeActionType.js';
export const storeSlice = ((constructor) => {
    const sanitizedClassName = constructor.name.replaceAll('StoreSlice', '').replaceAll('Store', '');
    const decoratedStoreSlice = constructor;
    const initialValues = new constructor();
    // redux checks value prototypes, if direct prototype is no Object, it writes warning in console,
    const plainInitialValues = { ...initialValues };
    decoratedStoreSlice.update = makeActionType({
        controllerName: sanitizedClassName,
        methodName: 'updateStore',
    });
    decoratedStoreSlice.reducer = createStoreSliceReducer(plainInitialValues, decoratedStoreSlice.update);
    return decoratedStoreSlice;
});
export function isDecoratedStoreSlice(storeSliceConstructor) {
    if (!storeSliceConstructor) {
        return false;
    }
    if (typeof storeSliceConstructor !== 'function') {
        return false;
    }
    return (('update') in storeSliceConstructor &&
        ('reducer') in storeSliceConstructor);
}
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
export function getStoreSliceUpdateActionType(storeSliceConstructor) {
    return (isDecoratedStoreSlice(storeSliceConstructor) && storeSliceConstructor.update) || '';
}
//# sourceMappingURL=storeSlice.js.map