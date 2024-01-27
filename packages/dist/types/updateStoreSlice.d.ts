import type { Constructor } from './types/index.js';
export declare function updateStoreSlice<T, StoreSlice extends Constructor<T>>(storeSlice: StoreSlice): (partialStore: Partial<InstanceType<StoreSlice>>) => import("./types/Action.js").Action<Partial<InstanceType<StoreSlice>>>;
