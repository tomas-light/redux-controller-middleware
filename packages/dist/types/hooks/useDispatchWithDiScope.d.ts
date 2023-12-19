/**
 * Warning! it is experimental hook, we don't recommend to use it
 * adds current container scope (from React.Context) to dispatched action to resolve all dependencies from its scope
 * */
export declare function useDispatchWithDiScope(): import("redux").Dispatch<import("redux").UnknownAction>;
