import type { DependencyResolver } from 'cheap-di';
import { type Action } from './types/index.js';
export declare function tryToFindDependencyContainer<Payload = undefined>(action: Action<Payload>, container?: DependencyResolver | (() => DependencyResolver)): DependencyResolver | undefined;
