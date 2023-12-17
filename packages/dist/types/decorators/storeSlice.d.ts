import { Reducer } from 'redux';
import { Action, Constructor } from '../types/index.js';
export type DecoratedStoreSlice<StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice> = Constructor<StoreSlice>> = StoreSliceConstructor & {
    update: string;
    reducer: Reducer<StoreSlice, Action<Partial<StoreSlice>>>;
};
export interface StoreSliceDecorator {
    <StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(constructor: StoreSliceConstructor, context: ClassDecoratorContext): StoreSliceConstructor;
    <StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(constructor: StoreSliceConstructor): StoreSliceConstructor;
}
export declare const storeSlice: StoreSliceDecorator;
export declare function isDecoratedStoreSlice<StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice> = Constructor<StoreSlice>>(storeSlice: StoreSliceConstructor): storeSlice is DecoratedStoreSlice<StoreSlice, StoreSliceConstructor>;
