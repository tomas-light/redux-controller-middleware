import { DependencyResolver } from 'cheap-di';
import { MiddlewareAPI } from 'redux';
import { ControllerInfo } from '../constants';
import { Action } from '../types';

type Parameters = {
  action: Action;
  container: DependencyResolver | undefined;
  controllerData: ControllerInfo;
  middlewareAPI: MiddlewareAPI;
};

export async function callActionReducer(parameters: Parameters) {
  const {
    //
    action,
    container,
    controllerData,
    middlewareAPI,
  } = parameters;

  const { controllerConstructor, methodName } = controllerData;

  let controller: Record<string, (action: Action) => any>;
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
