import { DecoratedStoreSlice, storeSlice } from './decorators';
import { getReducersFromStoreSlices } from './getReducersFromStoreSlices';

describe('[function] getReducersFromStoreSlices', () => {
  test('it returns slice reducers', () => {
    @storeSlice
    class StoreSlice1 {
      isLoading = true;
    }
    @storeSlice
    class StoreSlice2 {
      open = false;
    }
    @storeSlice
    class StoreSlice3 {
      counter = 0;
    }

    const reducers = getReducersFromStoreSlices({
      slice1: StoreSlice1,
      slice2: StoreSlice2,
      slice3: StoreSlice3,
    });

    expect(reducers).toEqual({
      slice1: (StoreSlice1 as unknown as DecoratedStoreSlice<StoreSlice1>).reducer,
      slice2: (StoreSlice2 as unknown as DecoratedStoreSlice<StoreSlice2>).reducer,
      slice3: (StoreSlice3 as unknown as DecoratedStoreSlice<StoreSlice3>).reducer,
    });
  });
});
