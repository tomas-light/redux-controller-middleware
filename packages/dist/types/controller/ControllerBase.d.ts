import { Dispatch } from 'redux';
import { Middleware } from '../Middleware.js';
import { Action, Constructor, Controller } from '../types/index.js';
export declare class ControllerBase<StoreSliceInstance, State extends Record<string, unknown> = Record<string, unknown>> implements Controller<State> {
    private readonly storeSlice?;
    protected readonly dispatch: Dispatch<Action<unknown>>;
    protected readonly getState: () => State;
    constructor(middleware: Middleware<State>, storeSlice?: Constructor<StoreSliceInstance> | undefined);
    protected updateStoreSlice(partialStore: Partial<StoreSliceInstance>): void;
}
