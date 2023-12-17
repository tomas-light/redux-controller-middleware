import { Reducer, UnknownAction } from 'redux';
import { Action } from './types/index.js';
export declare function createStoreSliceReducer<StoreSlice>(initialStore: StoreSlice, updateActionType: UnknownAction['type']): Reducer<StoreSlice, Action<Partial<StoreSlice>>>;
