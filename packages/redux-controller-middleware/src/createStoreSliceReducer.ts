import type { Reducer, UnknownAction } from 'redux';
import { actionPromises } from './actionPromises.js';
import type { Action } from './types/index.js';

export function createStoreSliceReducer<StoreSlice>(initialStore: StoreSlice, updateActionType: UnknownAction['type']) {
  const storeSliceReducer: Reducer<StoreSlice, Action<Partial<StoreSlice>>> = (store = initialStore, action) => {
    if (action.type !== updateActionType) {
      return store;
    }

    // timer because we can't predict, when redux applies changes
    setTimeout(() => {
      actionPromises.resolveAll(action);
    });

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
