import { createReducer } from './createReducer';
import { updateStoreSlice } from './updateStoreSlice';

describe('[function] createReducer', () => {
  test('action factory type of reducers with action is a passed action type', () => {
    class UserSlice {
      name: string | undefined;
    }

    const createUser = createReducer<{ name: string }>('createUser', async ({ action, dispatch, getState }) => {
      updateStoreSlice(UserSlice)({
        name: action.payload.name,
      });
    });

    const action = createUser({ name: '' });
    expect(action.type.startsWith('createUser')).toBe(true);
  });

  test('action factory type of reducers without action is just a function', () => {
    const loadUsers = createReducer('loadUsers', async () => {});
    const action = loadUsers();
    expect(action.type.startsWith('loadUsers')).toBe(true);
  });
});
