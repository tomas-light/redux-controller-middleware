import { createStoreSliceReducer } from '../createStoreSliceReducer.js';
export const storeSlice = ((constructor) => {
    const sanitizedClassName = constructor.name.replaceAll('StoreSlice', '').replaceAll('Store', '');
    const decoratedStoreSlice = constructor;
    // add action type for store updates
    const updateStoreActionType = `${sanitizedClassName}_update_store`;
    const initialValues = new constructor();
    decoratedStoreSlice.update = updateStoreActionType;
    decoratedStoreSlice.reducer = createStoreSliceReducer(initialValues, updateStoreActionType);
    return decoratedStoreSlice;
});
export function isDecoratedStoreSlice(storeSlice) {
    if (!storeSlice) {
        return false;
    }
    if (typeof storeSlice !== 'function') {
        return false;
    }
    return (('update') in storeSlice &&
        ('reducer') in storeSlice);
}
//# sourceMappingURL=storeSlice.js.map