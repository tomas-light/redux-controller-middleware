"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockMiddlewareFoTests = void 0;
const cheap_di_1 = require("cheap-di");
const index_js_1 = require("../decorators/index.js");
const controllerMiddleware_js_1 = require("./controllerMiddleware.js");
/**
 * it helps you to mock the middleware for unit-tests
 *
 * */
function mockMiddlewareFoTests(storeSliceClass, 
/**
 * this name is used to put slice in `getState` function of redux middleware.
 * It is needed in cases your controller call `this.getState().<storeSliceName>` to get something from the store
 * */
storeSliceName) {
    const dispatchedActions = [];
    const storeSlice = new storeSliceClass();
    const updateActionType = (0, index_js_1.getStoreSliceUpdateActionType)(storeSliceClass);
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
    const container = new cheap_di_1.ContainerImpl();
    const mockedControllerMiddleware = (0, controllerMiddleware_js_1.controllerMiddleware)({
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
exports.mockMiddlewareFoTests = mockMiddlewareFoTests;
//# sourceMappingURL=mockMiddlewareFoTests.js.map