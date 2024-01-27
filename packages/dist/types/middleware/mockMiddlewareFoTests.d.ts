import { type Container } from 'cheap-di';
import { Action, Constructor } from '../types/index.js';
export type DispatchedAction<Payload = unknown> = {
    type: string;
    payload: Payload;
};
export type MockedMiddlewareForTest<StoreSliceConstructor extends Constructor> = {
    /**
     * dispatched actions list to check actions order or content
     * @example
     * const { actions } = mockMiddlewareFoTests(...)
     * const [firstAction] = actions
     * expect(firstAction.type).toBe('my action type')
     * */
    dispatchedActions: DispatchedAction[];
    /**
     * store slice, to apply assertions based on changed data in the slice
     * @example
     * const { storeSlice } = mockMiddlewareFoTests(...)
     * expect(storeSlice.myData).toBe(...)
     * */
    storeSlice: InstanceType<StoreSliceConstructor>;
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
    /** container instance, it allows you to mock any dependency you wish per test */
    container: Container;
};
/**
 * it helps you to mock the middleware for unit-tests
 *
 * */
export declare function mockMiddlewareFoTests<StoreSliceName extends string, StoreSliceConstructor extends Constructor, State extends {
    [sliceName in StoreSliceName]: InstanceType<StoreSliceConstructor>;
}>(storeSliceClass: StoreSliceConstructor, 
/**
 * this name is used to put slice in `getState` function of redux middleware.
 * It is needed in cases your controller call `this.getState().<storeSliceName>` to get something from the store
 * */
storeSliceName?: StoreSliceName): MockedMiddlewareForTest<StoreSliceConstructor>;
