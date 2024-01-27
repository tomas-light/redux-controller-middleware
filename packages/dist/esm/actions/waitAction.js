import { actionPromises } from '../actionPromises.js';
/**
 * it creates promise, that will be resolved, after action is processed by the middleware. If `dispatch` function is passed it will be called with passed action *
 * @example
 * const dispatch = useDispatch();
 *
 * // detailed using
 * const action = MyController.fetchUsers();
 * dispatch(action);
 * await waitAction(action);
 *
 * // same as above, short syntax
 * await waitAction(MyController.fetchUsers(), dispatch);
 * */
export function waitAction(action, dispatch) {
    const promise = actionPromises.add(action);
    dispatch?.(action);
    return promise;
}
//# sourceMappingURL=waitAction.js.map