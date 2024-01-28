import { inject } from 'cheap-di';
import type { Dispatch } from 'redux';
import { waitAction } from './actions/index.js';
import { Middleware } from './middleware/index.js';
import type { Action, Constructor, Controller } from './types/index.js';
import { updateStoreSlice } from './updateStoreSlice.js';

@inject(Middleware)
export class ControllerBase<StoreSliceInstance, State extends Record<string, unknown> = Record<string, unknown>>
  implements Controller<State>
{
  protected readonly dispatch: Dispatch<Action<unknown>>;
  protected readonly getState: () => State;

  constructor(
    middleware: Middleware<State>,
    private readonly storeSlice?: Constructor<StoreSliceInstance>
  ) {
    if (new.target === ControllerBase) {
      throw new Error('Cannot construct ControllerBase instance directly');
    }

    this.dispatch = (...actions) => middleware?.dispatch(...actions);
    this.getState = () => middleware?.getState();
  }

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
  protected async updateStoreSlice(partialStore: Partial<StoreSliceInstance>) {
    const { storeSlice } = this;

    if (!storeSlice) {
      throw new Error('You have to pass storeSlice to ControllerBase\'s "super" to use "this.updateStoreSlice" method');
    }

    await waitAction(updateStoreSlice(storeSlice)(partialStore), this.dispatch);
  }
}
