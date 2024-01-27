import { ContainerImpl } from 'cheap-di';
import { getStoreSliceUpdateActionType } from '../decorators/index.js';
import { controllerMiddleware } from './controllerMiddleware.js';
/**
 * it helps you to mock the middleware for unit-tests
 *
 * */
export function mockMiddlewareFoTests(storeSliceClass, 
/**
 * this name is used to put slice in `getState` function of redux middleware.
 * It is needed in cases your controller call `this.getState().<storeSliceName>` to get something from the store
 * */
storeSliceName) {
    const dispatchedActions = [];
    const storeSlice = new storeSliceClass();
    const updateActionType = getStoreSliceUpdateActionType(storeSliceClass);
    const middlewareAPI = {
        dispatch: (action) => {
            dispatchedActions.push({
                type: action.type,
                payload: action.payload,
            });
            if (action.type === updateActionType && action.payload != null) {
                for (const [key, value] of Object.entries(action.payload)) {
                    storeSlice[key] = value;
                }
            }
            return action;
        },
        getState: () => ({
            [storeSliceName ?? 'store slice name is not passed']: storeSlice,
        }),
    };
    const container = new ContainerImpl();
    const mockedControllerMiddleware = controllerMiddleware({
        container,
    })(middlewareAPI);
    const dispatch = async (action) => {
        mockedControllerMiddleware(() => { })(action);
        await new Promise((resolve) => {
            action.executionCompleted = resolve;
        });
    };
    return {
        dispatchedActions,
        storeSlice,
        dispatch,
        container,
    };
}
//# sourceMappingURL=mockMiddlewareFoTests.js.map