import { createStoreSliceReducer } from '../createStoreSliceReducer.js';
import { makeActionType } from './makeActionType.js';
export const storeSlice = ((constructor) => {
    const sanitizedClassName = constructor.name.replaceAll('StoreSlice', '').replaceAll('Store', '');
    const decoratedStoreSlice = constructor;
    const initialValues = new constructor();
    decoratedStoreSlice.update = makeActionType({
        controllerName: sanitizedClassName,
        methodName: 'updateStore',
    });
    decoratedStoreSlice.reducer = createStoreSliceReducer(initialValues, decoratedStoreSlice.update);
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