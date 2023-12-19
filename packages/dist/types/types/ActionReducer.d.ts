import { ActionReducerParameters } from './ActionReducerParameters.js';
export type ActionReducer<Payload, State> = (parameters: ActionReducerParameters<Payload, State>) => any;
