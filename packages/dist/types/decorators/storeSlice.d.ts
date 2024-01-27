import type { Reducer } from 'redux';
import type { Action, Constructor } from '../types/index.js';
export type DecoratedStoreSlice<StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice> = Constructor<StoreSlice>> = StoreSliceConstructor & {
    update: string;
    reducer: Reducer<StoreSlice, Action<Partial<StoreSlice>>>;
};
export interface StoreSliceDecorator {
    <StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(constructor: StoreSliceConstructor, context: ClassDecoratorContext): StoreSliceConstructor;
    <StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(constructor: StoreSliceConstructor): StoreSliceConstructor;
}
export declare const storeSlice: StoreSliceDecorator;
export declare function isDecoratedStoreSlice<StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice> = Constructor<StoreSlice>>(storeSliceConstructor: StoreSliceConstructor): storeSliceConstructor is DecoratedStoreSlice<StoreSlice, StoreSliceConstructor>;
/**
 * returns action type of store slice updating action, if passed slice is decorated with @storeSlice
 * @example
 * import { getStoreSliceUpdateActionType, storeSlice, updateStoreSlice } from 'redux-controller-middleware';
 *
 * \@storeSlice
 * class MySlice {
 *   ...
 * }
 *
 * const updateAction = updateStoreSlice(MySlice);
 * const updateActionType = getStoreSliceUpdateActionType(MySlice);
 *
 * updateActionType === updateAction.type // true
 * */
export declare function getStoreSliceUpdateActionType<StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(storeSliceConstructor: StoreSliceConstructor): string;
