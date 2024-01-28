import { faker } from '@faker-js/faker';
import { createReducer, storeSlice, updateStoreSlice } from 'redux-controller-middleware';

export type User = {
  userId: string;
  userName: string;
};

@storeSlice
export class UsersSlice {
  usersList: User[] = [];
}

export const addUser = createReducer<{ name: string }, { users: UsersSlice }>(
  'addUser',
  async ({ action, dispatch, getState }) => {
    const newUser = await Promise.resolve().then(() => ({
      userId: faker.string.uuid(),
      userName: action.payload.name,
    }));

    const { usersList } = getState().users;

    dispatch(
      updateStoreSlice(UsersSlice)({
        usersList: usersList.concat(newUser),
      })
    );
  }
);
