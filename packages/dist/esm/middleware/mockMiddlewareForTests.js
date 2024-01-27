import { ContainerImpl } from 'cheap-di';
import { actionPromises } from '../actionPromises.js';
import { getStoreSliceUpdateActionType } from '../decorators/index.js';
import { controllerMiddleware } from './controllerMiddleware.js';
/**
 * it helps you to mock the middleware for unit-tests
 * @example
 * const mockedMiddleware = mockMiddlewareForTests({ users: UsersSlice });
 * const { dispatch, state } = mockedMiddleware;
 *
 * await dispatch(UsersController.fetchUsers());
 * expect(state.users.list).toEqual([...]);
 * */
export function mockMiddlewareForTests(storeConfig = {}) {
    const entries = Object.entries(storeConfig);
    const state = {};
    const storeUpdateActionTypesMap = new Map();
    entries.forEach(([storeSliceName, storeSliceConstructor]) => {
        const storeSlice = new storeSliceConstructor();
        state[storeSliceName] = storeSlice;
        const updateActionType = getStoreSliceUpdateActionType(storeSliceConstructor);
        storeUpdateActionTypesMap.set(updateActionType, storeSlice);
    });
    const dispatchedActions = [];
    const middlewareAPI = {
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
    const mockedControllerMiddleware = controllerMiddleware({
        container,
    })(middlewareAPI);
    const dispatch = async (action) => {
        mockedControllerMiddleware(() => { })(action);
        await actionPromises.add(action);
    };
    return {
        container,
        state,
        dispatch,
        dispatchedActions,
    };
}
//# sourceMappingURL=mockMiddlewareForTests.js.map