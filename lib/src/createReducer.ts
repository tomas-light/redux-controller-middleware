import { AnyAction, Reducer as ReduxReducer } from 'redux';
import { Action, ActionType } from './types';

export function createReducer<TStore>(initialStore: TStore, updateActionType: ActionType) {
  return ((store: TStore = initialStore, action: Action<any>): TStore => {
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
  }) as ReduxReducer<TStore, AnyAction>;
}
