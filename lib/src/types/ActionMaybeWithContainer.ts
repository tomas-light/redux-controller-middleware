import { Container, IHaveDependencies } from 'cheap-di';
import { Action } from './Action';

export interface ActionMaybeWithContainer<Payload = any> extends Action<Payload> {
	container?: Container & IHaveDependencies;
}
