import { DependencyResolver } from 'cheap-di';
import { Action } from '../types/index.js';
export declare function tryToFindDependencyContainer<Payload = undefined>(action: Action<Payload>, container?: DependencyResolver | (() => DependencyResolver)): DependencyResolver | undefined;
