import { type Container, ContainerImpl } from 'cheap-di';
import type { Dispatch, MiddlewareAPI } from 'redux';
import { actionPromises } from '../actionPromises.js';
import { getStoreSliceUpdateActionType } from '../decorators/index.js';
import type { Action, Constructor } from '../types/index.js';
import { controllerMiddleware } from './controllerMiddleware.js';

export type DispatchedAction<Payload = unknown> = {
  type: string;
  payload: Payload;
};

export type MockedMiddlewareForTest<StoreSlices extends Record<string, Constructor>> = {
  /** container instance, it allows you to mock any dependency you wish per test */
  container: Container;

  /**
   * store, to apply assertions based on changed data in the slice
   * @example
   * const { state } = mockMiddlewareFoTests(...)
   * expect(state.mySlice.myData).toBe(...)
   * */
  state: {
    [sliceName in keyof StoreSlices]: InstanceType<StoreSlices[sliceName]>;
  };

  /**
   * mocked dispatching
   * @example
   * test('', () => {
   *   const { dispatch } = mockMiddlewareFoTests(UsersSlice, 'users');
   *   await dispatch(UserController.fetchUsers())
   *   expect(...)
   * }
   * */
  dispatch: (action: Action<unknown>) => Promise<void>;

  /**
   * dispatched actions list to check actions order or content
   * @example
   * const { actions } = mockMiddlewareFoTests(...)
   * const [firstAction] = actions
   * expect(firstAction.type).toBe('my action type')
   * */
  dispatchedActions: DispatchedAction[];
};

/**
 * it helps you to mock the middleware for unit-tests
 * @example
 * const mockedMiddleware = mockMiddlewareForTests({ users: UsersSlice });
 * const { dispatch, state } = mockedMiddleware;
 *
 * await dispatch(UsersController.fetchUsers());
 * expect(state.users.list).toEqual([...]);
 * */
export function mockMiddlewareForTests<StoreSlices extends Record<string, Constructor> = Record<never, Constructor>>(
  storeConfig: StoreSlices = {} as StoreSlices
): MockedMiddlewareForTest<StoreSlices> {
  type State = {
    [sliceName in keyof StoreSlices]: InstanceType<StoreSlices[sliceName]>;
  };

  const entries = Object.entries(storeConfig) as [keyof State, Constructor][];

  const state = {} as State;
  const storeUpdateActionTypesMap = new Map<string, InstanceType<StoreSlices[string]>>();

  entries.forEach(([storeSliceName, storeSliceConstructor]) => {
    const storeSlice = new storeSliceConstructor();
    state[storeSliceName] = storeSlice;

    const updateActionType = getStoreSliceUpdateActionType(storeSliceConstructor);
    storeUpdateActionTypesMap.set(updateActionType, storeSlice);
  });

  const dispatchedActions: DispatchedAction[] = [];

  const middlewareAPI: MiddlewareAPI<Dispatch, State> = {
    dispatch: (action) => {
      dispatchedActions.push({
        type: action.type,
        payload: action.payload,
      });

      const storeSlice = storeUpdateActionTypesMap.get(action.type);

      if (storeSlice && action.payload != null) {
        Object.assign(storeSlice, action.payload);
      }

      return action;
    },
    getState: () => state,
  };

  const container = new ContainerImpl();

  const mockedControllerMiddleware = controllerMiddleware<State>({
    container,
  })(middlewareAPI);

  const dispatch = async (action: Action<unknown>) => {
    mockedControllerMiddleware(() => {})(action);
    await actionPromises.add(action);
  };

  return {
    container,
    state,
    dispatch,
    dispatchedActions,
  };
}
