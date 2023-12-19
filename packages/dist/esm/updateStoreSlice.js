import { createAction } from './actions/index.js';
import { isDecoratedStoreSlice } from './decorators/index.js';
export function updateStoreSlice(storeSlice) {
    if (!isDecoratedStoreSlice(storeSlice)) {
        throw new Error('Passed store slice is not decorated with @storeSlice decorator');
    }
    return (partialStore) => {
        return createAction(storeSlice.update, partialStore);
    };
}
//# sourceMappingURL=updateStoreSlice.js.map