import type { Action } from './types/index.js';
export declare const actionPromises: {
    map: Map<string, (() => void)[]>;
    add: (action: Action<unknown>) => Promise<void>;
    resolveAll: (action: Action<unknown>) => void;
};
