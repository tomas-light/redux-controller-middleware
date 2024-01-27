import { faker } from '@faker-js/faker';
import {
  type DispatchedAction,
  getStoreSliceUpdateActionType,
  mockMiddlewareForTests,
} from 'redux-controller-middleware';
import { describe, expect, test } from 'vitest';
import { UsersController, UsersSlice } from './UsersController.ts';

describe('[class] UserController', () => {
  describe('[method] addUser', () => {
    const fakeUserName = faker.person.fullName();

    async function dispatchFetchUsersAction() {
      const mockedMiddleware = mockMiddlewareForTests({ users: UsersSlice });
      const { dispatch } = mockedMiddleware;

      // dispatch action and wait until it will be resolved
      await dispatch(UsersController.addUser({ name: fakeUserName }));

      return mockedMiddleware;
    }

    test('it updates userList in store with passed user', async () => {
      const { dispatchedActions, state } = await dispatchFetchUsersAction();

      const lastAction = dispatchedActions.at(-1) as DispatchedAction<Partial<UsersSlice>> | undefined;
      const updateActionType = getStoreSliceUpdateActionType(UsersSlice);

      expect(lastAction?.type).toBe(updateActionType);
      expect(lastAction?.payload.usersList?.length).toBe(1);

      const [singleUser] = lastAction?.payload.usersList ?? [];
      expect(singleUser.userName).toBe(fakeUserName);

      const [singleUserInStore] = state.users.usersList;
      expect(singleUserInStore.userName).toBe(fakeUserName);
    });
  });
});
