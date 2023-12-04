import { Constructor } from './types';

export const actionToControllerMap = new Map<
  string, // action type
  ControllerInfo
>();

export interface ControllerInfo {
  controllerConstructor: Constructor;
  methodName: string;
}

// todo: use context.metadata for passing method names from method-decorator, when it will be ready
export const methodNamesTemporaryBox = [] as string[];
