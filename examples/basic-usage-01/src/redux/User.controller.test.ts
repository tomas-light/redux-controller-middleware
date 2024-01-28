import { faker } from '@faker-js/faker';
import {
  type DispatchedAction,
  getStoreSliceUpdateActionType,
  makeActionType,
  mockMiddlewareForTests,
} from 'redux-controller-middleware';
import { UserApi } from '../api/UserApi.js';
import type { User } from '../types/User.js';
import { UserController } from './User.controller.js';
import { UserSlice } from './User.slice.js';

describe('[class] UserController', () => {
  describe('[method] loadUsers', () => {
    const fakeUser: User = {
      userId: faker.number.int(),
      name: faker.person.fullName(),
    };
    const fakeUserList: User[] = [fakeUser];

    const updateActionType = getStoreSliceUpdateActionType(UserSlice);

    async function dispatchFetchUsersAction(apiResponseSucceed = true) {
      const mockedMiddleware = mockMiddlewareForTests({ users: UserSlice });
      const { dispatch, container } = mockedMiddleware;

      class MockedUserApi extends UserApi {
        async getUsers() {
          return {
            ok: apiResponseSucceed,
            data: fakeUserList,
          };
        }
      }

      container.registerImplementation(MockedUserApi).as(UserApi);

      // dispatch action and wait until it will be resolved
      await dispatch(UserController.loadUsers());

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
      } satisfies DispatchedAction<Partial<UserSlice>>);
    });

    test('it updates usersAreLoading flag to false after requests completed', async () => {
      const { dispatchedActions } = await dispatchFetchUsersAction();

      const lastAction = dispatchedActions.at(-1) as DispatchedAction<Partial<UserSlice>> | undefined;

      expect(lastAction?.type).toBe(updateActionType);
      expect(lastAction?.payload.usersAreLoading).toBe(false);
    });

    test('it updates users map in store with api response', async () => {
      const { dispatchedActions, state } = await dispatchFetchUsersAction();

      const lastAction = dispatchedActions.at(-1) as DispatchedAction<Partial<UserSlice>> | undefined;

      expect(lastAction?.type).toBe(updateActionType);
      expect(lastAction?.payload.users?.size).toBe(1);

      const [singleUser] = lastAction?.payload.users?.values() ?? [];
      expect(singleUser).toBe(fakeUser);

      const [singleUserInStore] = state.users.users.values();
      expect(singleUserInStore).toBe(fakeUser);
    });

    test('it updates usersAreLoading flag to false even if request will fail', async () => {
      const { dispatchedActions } = await dispatchFetchUsersAction(false);

      const [, secondAction] = dispatchedActions as DispatchedAction<Partial<UserSlice>>[];

      expect(secondAction?.type).toBe(updateActionType);
      expect(secondAction?.payload.usersAreLoading).toBe(false);
    });

    test('if request will fail, it dispatches error toaster showing action', async () => {
      const { dispatchedActions } = await dispatchFetchUsersAction(false);

      const [, , thirdAction] = dispatchedActions as DispatchedAction<{ error: string }>[];

      const showErrorToastActionTypePart = makeActionType({
        controllerName: 'User',
        methodName: 'showErrorToast',
      });

      expect(thirdAction?.type.startsWith(showErrorToastActionTypePart)).toBe(true);
      expect(thirdAction?.payload.error).toBe('Oops! Something went wrong...');
    });
  });

  describe('[method] openUserById', () => {
    test('it sets user as opened user if user with passed ID is presented in users map', async () => {
      const mockedMiddleware = mockMiddlewareForTests({ users: UserSlice });
      const { dispatch, state } = mockedMiddleware;

      const fakeUser: User = {
        userId: faker.number.int(),
        name: faker.person.fullName(),
      };

      state.users.users = new Map([[fakeUser.userId, fakeUser]]);

      // dispatch action and wait until it will be resolved
      await dispatch(UserController.openUserById({ userId: fakeUser.userId }));

      expect(state.users.openedUser).toBe(fakeUser);
    });
  });

  describe('[method] clearUser', () => {
    test('it sets opened user to null', async () => {
      const mockedMiddleware = mockMiddlewareForTests({ users: UserSlice });
      const { dispatch, state } = mockedMiddleware;

      state.users.openedUser = {
        userId: faker.number.int(),
        name: faker.person.fullName(),
      };

      // dispatch action and wait until it will be resolved
      await dispatch(UserController.clearUser());

      expect(state.users.openedUser).toBeNull();
    });
  });
});
