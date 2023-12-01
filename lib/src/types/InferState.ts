import { AnyAction, Reducer as ReduxReducer } from 'redux';

export type InferState<Reducers extends Record<string, ReduxReducer<any, AnyAction>>> = {
  [storeName in keyof Reducers as Reducers[storeName] extends ReduxReducer<any, any>
    ? storeName
    : never]: Reducers[storeName] extends ReduxReducer<infer Store, AnyAction> ? Store : never;
};
