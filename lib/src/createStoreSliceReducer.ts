import { Reducer, UnknownAction } from 'redux';
import { Action } from './types/index.js';

export function createStoreSliceReducer<StoreSlice>(initialStore: StoreSlice, updateActionType: UnknownAction['type']) {
  const storeSliceReducer: Reducer<StoreSlice, Action<Partial<StoreSlice>>> = (store = initialStore, action) => {
    if (action.type !== updateActionType) {
      return store;
    }

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
