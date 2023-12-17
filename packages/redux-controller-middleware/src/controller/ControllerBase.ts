import { inject } from 'cheap-di';
import { Dispatch } from 'redux';
import { Middleware } from '../Middleware.js';
import { Action, Constructor, Controller } from '../types/index.js';
import { updateStoreSlice } from '../updateStoreSlice.js';

@inject(Middleware)
export class ControllerBase<
  StoreSlice extends Constructor<unknown>,
  State extends Record<string, unknown> = Record<string, unknown>,
> implements Controller<State>
{
  protected readonly dispatch: Dispatch<Action<unknown>>;
  protected readonly getState: () => State;

  constructor(
    middleware: Middleware<State>,
    private readonly storeSlice: StoreSlice
  ) {
    if (new.target === ControllerBase) {
      throw new Error('Cannot construct ControllerBase instance directly');
    }

    this.dispatch = middleware?.dispatch;
    this.getState = () => middleware?.getState();
  }

  protected updateStoreSlice(partialStore: Partial<InstanceType<StoreSlice>>) {
    this.dispatch(updateStoreSlice(this.storeSlice)(partialStore));
  }
}
