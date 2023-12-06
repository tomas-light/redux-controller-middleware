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
export function getReducersFromStoreSlices<StoreSlices extends Record<string, Constructor>>(
  storeSlices: StoreSlices
): ReducersFromStores<StoreSlices> {
  return Object.entries(storeSlices).reduce((reducers, [reducerName, storeSlice]) => {
    if (isDecoratedStoreSlice(storeSlice)) {
      reducers[reducerName as keyof StoreSlices] = storeSlice.reducer as ReducerFromStore<
        StoreSlices[keyof StoreSlices]
      >;
    }

    return reducers;
  }, {} as ReducersFromStores<StoreSlices>);
}

export type ReducerFromStore<StoreSlice> = StoreSlice extends Constructor
  ? Reducer<InstanceType<StoreSlice>>
  : Reducer<StoreSlice>;

export type ReducersFromStores<StoreSlices extends Record<string, Constructor>> = {
  [sliceName in keyof StoreSlices]: ReducerFromStore<StoreSlices[sliceName]>;
};
