import { type Container } from 'cheap-di';
import type { Action, Constructor } from '../types/index.js';
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
export declare function mockMiddlewareForTests<StoreSlices extends Record<string, Constructor> = Record<never, Constructor>>(storeConfig?: StoreSlices): MockedMiddlewareForTest<StoreSlices>;
