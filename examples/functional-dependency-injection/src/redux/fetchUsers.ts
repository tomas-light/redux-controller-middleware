import { createReducer, storeSlice, updateStoreSlice } from 'redux-controller-middleware';
import { UserApi } from './services.ts';

@storeSlice
export class UsersSlice {
  usersAreLoading = false;
  usersList: string[] = [];
}

export const fetchUsers = createReducer('fetchUsers', async ({ container, dispatch }) => {
  dispatch(
    updateStoreSlice(UsersSlice)({
      usersAreLoading: true,
    })
  );

  const userApi = container?.resolve(UserApi);
  const users = (await userApi?.get()) ?? [];

  dispatch(
    updateStoreSlice(UsersSlice)({
      usersList: users,
      usersAreLoading: false,
    })
  );
});
