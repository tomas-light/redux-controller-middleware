import type { Container } from 'cheap-di';
import type { Dispatch, MiddlewareAPI } from 'redux';
import type { Action } from './Action.js';

export type ActionReducerParameters<Payload, State = unknown> = MiddlewareAPI<Dispatch, State> & {
  action: Action<Payload>;
  container: Pick<Container, 'resolve'> | undefined;
};
