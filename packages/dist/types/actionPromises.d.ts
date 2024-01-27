import type { UnknownAction } from 'redux';
export declare const actionPromises: {
    map: Map<string, (() => void)[]>;
    add: (action: UnknownAction) => Promise<void>;
    resolveAll: (action: UnknownAction) => void;
};
