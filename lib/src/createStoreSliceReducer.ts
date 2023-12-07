import { AnyAction, Reducer as ReduxReducer } from 'redux';
import { Action, ActionType } from './types/index.js';

export function createStoreSliceReducer<T>(initialStore: T, updateActionType: ActionType) {
  return ((store: T = initialStore, action: Action<any>): T => {
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
  }) as ReduxReducer<T, AnyAction>;
}
