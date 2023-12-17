import { ActionReducerParameters } from './constants.js';
import { Action } from './types/index.js';
type InferActionFactory<Payload> = undefined extends Payload ? () => Action : (payload: Payload) => Action<Payload>;
export declare function createReducer<Payload = undefined, State = unknown>(actionName: string, reducer: (parameters: ActionReducerParameters<Payload, State>) => any): InferActionFactory<Payload>;
export {};
