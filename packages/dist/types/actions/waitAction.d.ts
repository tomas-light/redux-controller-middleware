import type { Dispatch } from 'redux';
import type { Action } from '../types/index.js';
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
export declare function waitAction<Payload>(action: Action<Payload>, dispatch?: Dispatch): Promise<void>;
