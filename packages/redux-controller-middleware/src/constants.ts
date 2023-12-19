import { ActionReducerOrControllerMethod } from './types/index.js';

export const actionToControllerMap = new Map<
  string, // action type
  ActionReducerOrControllerMethod<any, any>
>();

// todo: use context.metadata for passing method names from method-decorator, when it will be ready
export const methodNamesTemporaryBox = [] as string[];
