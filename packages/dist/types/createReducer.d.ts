import type { Action, ActionReducerParameters } from './types/index.js';
type InferActionFactory<Payload> = Payload extends undefined ? () => Action : (payload: Payload) => Action<Payload>;
export declare function createReducer<Payload = undefined, State = unknown>(actionName: string, reducer: (parameters: ActionReducerParameters<Payload, State>) => any): InferActionFactory<Payload>;
export {};
