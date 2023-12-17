import { Reducer } from 'redux';
import { createStoreSliceReducer } from '../createStoreSliceReducer.js';
import { Action, Constructor } from '../types/index.js';

export type DecoratedStoreSlice<
  StoreSlice,
  StoreSliceConstructor extends Constructor<StoreSlice> = Constructor<StoreSlice>,
> = StoreSliceConstructor & {
  update: string;
  reducer: Reducer<StoreSlice, Action<Partial<StoreSlice>>>;
};

export interface StoreSliceDecorator {
  // stage 3 decorator
  <StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(
    constructor: StoreSliceConstructor,
    context: ClassDecoratorContext
  ): StoreSliceConstructor;

  // stage 2 decorator
  <StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(
    constructor: StoreSliceConstructor
  ): StoreSliceConstructor;
}

export const storeSlice: StoreSliceDecorator = (<StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(
  constructor: StoreSliceConstructor
) => {
  const sanitizedClassName = constructor.name.replaceAll('StoreSlice', '').replaceAll('Store', '');

  const decoratedStoreSlice = constructor as DecoratedStoreSlice<StoreSlice, StoreSliceConstructor>;

  // add action type for store updates
  const updateStoreActionType = `${sanitizedClassName}_update_store`;
  const initialValues = new constructor();

  decoratedStoreSlice.update = updateStoreActionType;
  decoratedStoreSlice.reducer = createStoreSliceReducer(initialValues, updateStoreActionType);

  return decoratedStoreSlice;
}) as StoreSliceDecorator;

export function isDecoratedStoreSlice<
  StoreSlice,
  StoreSliceConstructor extends Constructor<StoreSlice> = Constructor<StoreSlice>,
>(storeSlice: StoreSliceConstructor): storeSlice is DecoratedStoreSlice<StoreSlice, StoreSliceConstructor> {
  if (!storeSlice) {
    return false;
  }
  if (typeof storeSlice !== 'function') {
    return false;
  }

  return (
    ('update' satisfies keyof DecoratedStoreSlice<StoreSlice, StoreSliceConstructor>) in storeSlice &&
    ('reducer' satisfies keyof DecoratedStoreSlice<StoreSlice, StoreSliceConstructor>) in storeSlice
  );
}
