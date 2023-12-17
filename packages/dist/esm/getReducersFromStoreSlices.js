import { isDecoratedStoreSlice } from './decorators/index.js';
/**
 * @example
 * \@storeSlice
 * class StoreSlice1 {
 *   isLoading = true;
 * }
 * \@storeSlice
 * class StoreSlice2 {
 *   open = false;
 * }
 * \@storeSlice
 * class StoreSlice3 {
 *   counter = 0;
 * }
 * const reducers = getReducersFromStoreSlices({
 *   slice1: StoreSlice1,
 *   slice2: StoreSlice2,
 *   slice3: StoreSlice3,
 * });
 *
 * import { combineReducers } from 'redux';
 * const rootReducer = combineReducers(reducers);
 * */
export function getReducersFromStoreSlices(storeSlices) {
    return Object.entries(storeSlices).reduce((reducers, [reducerName, storeSlice]) => {
        if (isDecoratedStoreSlice(storeSlice)) {
            reducers[reducerName] = storeSlice.reducer;
        }
        return reducers;
    }, {});
}
//# sourceMappingURL=getReducersFromStoreSlices.js.map