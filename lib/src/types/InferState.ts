import { Reducer } from 'redux';

export type InferState<Reducers extends Record<string, Reducer>> = {
  [storeName in keyof Reducers as Reducers[storeName] extends Reducer
    ? storeName
    : never]: Reducers[storeName] extends Reducer<infer Store> ? Store : never;
};
