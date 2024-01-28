import { faker } from '@faker-js/faker';
import {
  type DispatchedAction,
  getStoreSliceUpdateActionType,
  mockMiddlewareForTests,
} from 'redux-controller-middleware';
import { describe, expect, test } from 'vitest';
import { UserApi } from './services.ts';
import { fetchUsers, UsersSlice } from './fetchUsers.ts';

describe('[reducer] fetchUsers', () => {
  class MockedUserApi extends UserApi {
    async get() {
      return fakeUserList;
    }
  }

  const fakeUserList = [faker.person.fullName()];
  const updateActionType = getStoreSliceUpdateActionType(UsersSlice);

  async function dispatchFetchUsersAction() {
    const mockedMiddleware = mockMiddlewareForTests({ users: UsersSlice });
    const { dispatch, container } = mockedMiddleware;

    container.registerImplementation(MockedUserApi).as(UserApi);

    // dispatch action and wait until it will be resolved
    await dispatch(fetchUsers());

    return mockedMiddleware;
  }

  test('it updates usersAreLoading flag to true before sending requests', async () => {
    const { dispatchedActions } = await dispatchFetchUsersAction();

    const [firstAction] = dispatchedActions;
    expect(firstAction).toEqual({
      type: updateActionType,
      payload: {
        usersAreLoading: true,
      },
    } satisfies DispatchedAction<Partial<UsersSlice>>);
  });

  test('it updates usersAreLoading flag to false after requests completed', async () => {
    const { dispatchedActions } = await dispatchFetchUsersAction();

    const lastAction = dispatchedActions.at(-1) as DispatchedAction<Partial<UsersSlice>> | undefined;

    expect(lastAction?.type).toBe(updateActionType);
    expect(lastAction?.payload.usersAreLoading).toBe(false);
  });

  test('it updates userList in store with api response', async () => {
    const { dispatchedActions, state } = await dispatchFetchUsersAction();

    const lastAction = dispatchedActions.at(-1) as DispatchedAction<Partial<UsersSlice>> | undefined;

    expect(lastAction?.type).toBe(updateActionType);
    expect(lastAction?.payload.usersList).toBe(fakeUserList);

    expect(state.users.usersList).toEqual(fakeUserList);
  });
});
