import { DependencyResolver } from 'cheap-di';
import { MiddlewareAPI } from 'redux';
import { ActionReducerOrControllerMethod } from '../constants';
import { Action } from '../types';

type Parameters<Payload = undefined, State = unknown> = {
  action: Action<Payload>;
  container: DependencyResolver | undefined;
  actionReducer: ActionReducerOrControllerMethod<Payload, State>;
  middlewareAPI: MiddlewareAPI;
};

export async function callActionReducer<Payload = undefined, State = unknown>(parameters: Parameters<Payload, State>) {
  const {
    //
    action,
    container,
    actionReducer,
    middlewareAPI,
  } = parameters;

  if (typeof actionReducer === 'function') {
    try {
      await actionReducer({
        ...middlewareAPI,
        action,
      });
    } catch (error) {
      console.error('Unhandled exception in action reducer', error);
    }
    return;
  }

  for await (const [controllerConstructor, methodName] of actionReducer) {
    let controller: Record<string, (action: Action<any>) => any>;
    if (container) {
      controller = container.resolve(controllerConstructor);
    } else {
      controller = new controllerConstructor(middlewareAPI);
    }

    const reducer = controller[methodName];
    if (typeof reducer === 'function') {
      try {
        await reducer.call(controller, action);
      } catch (error) {
        console.error('Unhandled exception in controller', error);
      }
    }
  }
}
