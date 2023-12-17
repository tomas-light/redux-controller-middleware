import { createReducer, storeSlice, updateStoreSlice } from 'redux-controller-middleware';
import { UserApi } from './services.ts';

@storeSlice
export class UsersSlice {
  usersList: string[] = [];
}

export const fetchUsers = createReducer('fetchUsers', async ({ container, dispatch }) => {
  const userApi = container?.resolve(UserApi);
  if (!userApi) {
    return;
  }

  const users = await userApi.get();

  dispatch(
    updateStoreSlice(UsersSlice)({
      usersList: users,
    })
  );
});
