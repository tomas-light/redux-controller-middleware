import { storeSlice } from './decorators/index.js';
import { makeActionType } from './actions/makeActionType.js';
import { updateStoreSlice } from './updateStoreSlice.js';

describe('[function] updateStoreSlice', () => {
  test('it creates action for store updating', () => {
    @storeSlice
    class MyStore {
      foo = 'bar';
    }

    const myStore = new MyStore();
    myStore.foo = 'aa';

    const action = updateStoreSlice(MyStore)({ foo: '' });
    expect(action.type).toBe(
      makeActionType({
        controllerName: 'My',
        methodName: 'updateStore',
      })
    );
    expect(action.payload).toEqual({ foo: '' });
  });
});
