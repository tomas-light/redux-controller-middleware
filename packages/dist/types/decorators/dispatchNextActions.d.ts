import { MiddlewareAPI } from 'redux';
import { Action } from '../types/index.js';
export declare function dispatchNextActions(middlewareAPI: MiddlewareAPI, action: Action<unknown>): Promise<void>;
