import { Constructor } from './Constructor.js';

export type ControllerMethodMap = Map<
  Constructor, // controller ref
  string // method name
>;