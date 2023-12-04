import { AnyAction, Reducer } from 'redux';
import { createStoreSliceReducer } from '../createStoreSliceReducer';
import { Constructor } from '../types';

export type DecoratedStoreSlice<T, StoreSlice extends Constructor<T> = Constructor<T>> = StoreSlice & {
  update: string;
  reducer: Reducer<T, AnyAction>;
};

export function storeSlice<T, StoreSlice extends Constructor<T> = Constructor<T>>(
  constructor: StoreSlice,
  context?: ClassDecoratorContext<StoreSlice>
): DecoratedStoreSlice<T, StoreSlice> {
  const sanitizedClassName = constructor.name.replaceAll('StoreSlice', '').replaceAll('Store', '');

  const decoratedStoreSlice = constructor as DecoratedStoreSlice<T, StoreSlice>;

  // add action type for store updates
  const updateStoreActionType = `${sanitizedClassName}_update_store`;
  const initialValues = new constructor();

  decoratedStoreSlice.update = updateStoreActionType;
  decoratedStoreSlice.reducer = createStoreSliceReducer(initialValues, updateStoreActionType);

  return decoratedStoreSlice;
}

export function isDecoratedStoreSlice<T, StoreSlice extends Constructor<T> = Constructor<T>>(
  storeSlice: StoreSlice
): storeSlice is DecoratedStoreSlice<T, StoreSlice> {
  if (!storeSlice) {
    return false;
  }
  if (typeof storeSlice !== 'function') {
    return false;
  }

  return (
    ('update' satisfies keyof DecoratedStoreSlice<T, StoreSlice>) in storeSlice &&
    ('reducer' satisfies keyof DecoratedStoreSlice<T, StoreSlice>) in storeSlice
  );
}
