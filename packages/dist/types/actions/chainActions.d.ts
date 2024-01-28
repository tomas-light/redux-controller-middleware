import { type Action, type ActionFactory } from '../types/index.js';
export declare const FIRST_ACTION_IN_CHAIN_TYPE = "Action chain start";
export declare const FALLBACK_ACTION_TYPE = "No actions were passed to chain function";
export declare function chainActions(...actions: (ActionFactory | Action<unknown>)[]): Action<unknown>;
