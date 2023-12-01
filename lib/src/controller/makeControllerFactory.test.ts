import { MiddlewareAPI } from 'redux';
import { makeControllerFactory } from './makeControllerFactory';

const fakeMiddleware = {} as MiddlewareAPI;

class TestController {}

test('if there is no provided container it should instantiate controller by itself', () => {
  const controllerFactory = makeControllerFactory(fakeMiddleware, undefined);
  const controller = controllerFactory({
    type: TestController,
    get: () => '',
  });
  expect(controller instanceof TestController).toBeTruthy();
});

test('if there is provided container it should resolve controller with that container', () => {
  const resolveMock = jest.fn(() => new TestController());

  const noop = () => {};
  const withNoop: any = () => ({
    with: noop,
  });

  const controllerFactory = makeControllerFactory(fakeMiddleware, {
    resolve: resolveMock as any,
    registerInstance: () => ({
      as: noop,
    }),
    registerImplementation: () => ({
      as: withNoop,
      asSingleton: withNoop,
      inject: noop,
    }),
    clear() {},
  });

  const controller = controllerFactory({
    type: null as any,
    get: () => '',
  });

  expect(resolveMock).toBeCalledTimes(1);
  expect(controller instanceof TestController).toBeTruthy();
});
