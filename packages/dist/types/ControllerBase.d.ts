import { Dispatch } from 'redux';
import { Middleware } from './middleware/index.js';
import { Action, Constructor, Controller } from './types/index.js';
export declare class ControllerBase<StoreSliceInstance, State extends Record<string, unknown> = Record<string, unknown>> implements Controller<State> {
    private readonly storeSlice?;
    protected readonly dispatch: Dispatch<Action<unknown>>;
    protected readonly getState: () => State;
    constructor(middleware: Middleware<State>, storeSlice?: Constructor<StoreSliceInstance> | undefined);
    /**
     * You may wait until the store will be updated.
     *
     * There is setTimeout(() => resolve) called before returning changed slice in slice reducer.
     *
     * So we assume, the action will be resolved after changes will be applied to the redux state
     * @example
     *   \@reducer
     *   async fetchUsers() {
     *     const users = await this.userApi.get();
     *
     *     await this.updateStoreSlice({
     *       usersList: users,
     *     });
     *
     *     console.log('executed');
     *
     *     const { usersList } = this.getState().users;
     *     console.log(`list is updated ${usersList === users}`);
     *   }
     * */
    protected updateStoreSlice(partialStore: Partial<StoreSliceInstance>): Promise<void>;
}
