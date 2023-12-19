import { Reducer, UnknownAction } from 'redux';
import { Action } from './types/index.js';

export function createStoreSliceReducer<StoreSlice>(initialStore: StoreSlice, updateActionType: UnknownAction['type']) {
  const storeSliceReducer: Reducer<StoreSlice, Action<Partial<StoreSlice>>> = (store = initialStore, action) => {
    if (action.type !== updateActionType) {
      return store;
    }

    const { executionCompleted } = action;
    if (executionCompleted) {
      // timer because we can't predict, when redux applies changes
      setTimeout(() => {
        executionCompleted!();
      });
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
