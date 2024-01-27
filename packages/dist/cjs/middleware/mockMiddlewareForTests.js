"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockMiddlewareForTests = void 0;
const cheap_di_1 = require("cheap-di");
const actionPromises_js_1 = require("../actionPromises.js");
const index_js_1 = require("../decorators/index.js");
const controllerMiddleware_js_1 = require("./controllerMiddleware.js");
/**
 * it helps you to mock the middleware for unit-tests
 * @example
 * const mockedMiddleware = mockMiddlewareForTests({ users: UsersSlice });
 * const { dispatch, state } = mockedMiddleware;
 *
 * await dispatch(UsersController.fetchUsers());
 * expect(state.users.list).toEqual([...]);
 * */
function mockMiddlewareForTests(storeConfig = {}) {
    const entries = Object.entries(storeConfig);
    const state = {};
    const storeUpdateActionTypesMap = new Map();
    entries.forEach(([storeSliceName, storeSliceConstructor]) => {
        const storeSlice = new storeSliceConstructor();
        state[storeSliceName] = storeSlice;
        const updateActionType = (0, index_js_1.getStoreSliceUpdateActionType)(storeSliceConstructor);
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
            actionPromises_js_1.actionPromises.resolveAll(action);
            return action;
        },
        getState: () => state,
    };
    const container = new cheap_di_1.ContainerImpl();
    const mockedControllerMiddleware = (0, controllerMiddleware_js_1.controllerMiddleware)({
        container,
    })(middlewareAPI);
    const dispatch = async (action) => {
        mockedControllerMiddleware(() => { })(action);
        await actionPromises_js_1.actionPromises.add(action);
    };
    return {
        container,
        state,
        dispatch,
        dispatchedActions,
    };
}
exports.mockMiddlewareForTests = mockMiddlewareForTests;
//# sourceMappingURL=mockMiddlewareForTests.js.map