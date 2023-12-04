import { createAction } from './createAction';
import { isDecoratedStoreSlice } from './decorators';
import { Constructor } from './types';

export function updateStoreSlice<T, StoreSlice extends Constructor<T>>(storeSlice: StoreSlice) {
  if (!isDecoratedStoreSlice(storeSlice)) {
    throw new Error('Passed store slice is not decorated with @storeSlice decorator');
  }

  return (partialStore: Partial<InstanceType<StoreSlice>>) => {
    return createAction(storeSlice.update, partialStore);
  };
}
