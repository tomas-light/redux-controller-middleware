import type { MiddlewareAPI } from 'redux';
import { type Action } from '../types/index.js';
export declare function dispatchNextActions(middlewareAPI: MiddlewareAPI, action: Action<unknown>): Promise<void>;
