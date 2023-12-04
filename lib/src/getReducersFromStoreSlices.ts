import { Reducer } from 'redux';
import { isDecoratedStoreSlice } from './decorators';
import { Constructor } from './types';

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
export function getReducersFromStoreSlices<
  StoreSlices extends {
    [sliceName: string]: Constructor;
  },
>(storeSlices: StoreSlices) {
  return Object.entries(storeSlices).reduce(
    (reducers, [reducerName, storeSlice]) => {
      if (isDecoratedStoreSlice(storeSlice)) {
        reducers[reducerName as keyof StoreSlices] = storeSlice.reducer as unknown as Reducer<
          StoreSlices[keyof StoreSlices]
        >;
      }

      return reducers;
    },
    {} as {
      [sliceName in keyof StoreSlices]: Reducer<StoreSlices[sliceName]>;
    }
  );
}
