import type { Reducer } from 'redux';
import { createStoreSliceReducer } from '../createStoreSliceReducer.js';
import type { Action, Constructor } from '../types/index.js';
import { makeActionType } from './makeActionType.js';

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

  const initialValues = new constructor();
  // redux checks value prototypes, if direct prototype is no Object, it writes warning in console,
  const plainInitialValues = { ...initialValues };

  decoratedStoreSlice.update = makeActionType({
    controllerName: sanitizedClassName,
    methodName: 'updateStore',
  });
  decoratedStoreSlice.reducer = createStoreSliceReducer(plainInitialValues, decoratedStoreSlice.update);

  return decoratedStoreSlice;
}) as StoreSliceDecorator;

export function isDecoratedStoreSlice<
  StoreSlice,
  StoreSliceConstructor extends Constructor<StoreSlice> = Constructor<StoreSlice>,
>(
  storeSliceConstructor: StoreSliceConstructor
): storeSliceConstructor is DecoratedStoreSlice<StoreSlice, StoreSliceConstructor> {
  if (!storeSliceConstructor) {
    return false;
  }
  if (typeof storeSliceConstructor !== 'function') {
    return false;
  }

  return (
    ('update' satisfies keyof DecoratedStoreSlice<StoreSlice, StoreSliceConstructor>) in storeSliceConstructor &&
    ('reducer' satisfies keyof DecoratedStoreSlice<StoreSlice, StoreSliceConstructor>) in storeSliceConstructor
  );
}

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
export function getStoreSliceUpdateActionType<StoreSlice, StoreSliceConstructor extends Constructor<StoreSlice>>(
  storeSliceConstructor: StoreSliceConstructor
) {
  return (isDecoratedStoreSlice(storeSliceConstructor) && storeSliceConstructor.update) || '';
}
