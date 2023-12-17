import { ActionReducerOrControllerMethod, actionToControllerMap, ControllerMethodMap } from '../constants.js';
import { Action, Constructor } from '../types/index.js';
import { controller } from './controller.js';
import { makeActionType } from './makeActionType.js';
import { reducer } from './reducer.js';

describe('[function] reduxController', () => {
  beforeEach(() => {
    actionToControllerMap.clear();
  });

  function makeActionControllerTupple<Controller extends Constructor>(
    controller: Controller,
    key: keyof InstanceType<Controller>
  ) {
    const methodName = key as string;
    return [
      makeActionType({
        controllerName: controller.name.replace('Controller', ''),
        methodName,
      }),
      new Map([[controller, methodName]]) satisfies ControllerMethodMap,
    ] satisfies [string, ActionReducerOrControllerMethod<any, any>];
  }

  function expectActionToControllers(methods: ReturnType<typeof makeActionControllerTupple>[]) {
    const sortKeys = (
      left: [string, ActionReducerOrControllerMethod<any, any>],
      right: [string, ActionReducerOrControllerMethod<any, any>]
    ) => {
      return left[0] > right[0] ? 1 : -1;
    };

    const actionToControllers = Array.from(actionToControllerMap.entries()).sort(sortKeys);
    const expected = methods.sort(sortKeys);

    expect(actionToControllers).toEqual(expected);
  }

  describe('single controller', () => {
    test('one handler data passed and registered', () => {
      @controller('')
      class TestController {
        @reducer
        action1() {}
      }

      expectActionToControllers([makeActionControllerTupple(TestController, 'action1')]);
    });

    test('many handlers data passed and registered', () => {
      @controller('')
      class Test {
        @reducer
        action1() {}
        @reducer
        action2() {}
        @reducer
        action3() {}
      }

      expectActionToControllers([
        makeActionControllerTupple(Test, 'action1'),
        makeActionControllerTupple(Test, 'action2'),
        makeActionControllerTupple(Test, 'action3'),
      ]);
    });
  });

  describe('two controllers', () => {
    test('one handler data passed and registered', () => {
      @controller('')
      class ControllerA1 {
        @reducer
        action1() {}
      }
      @controller('')
      class ControllerA2 {
        @reducer
        action2() {}
      }

      expectActionToControllers([
        makeActionControllerTupple(ControllerA1, 'action1'),
        makeActionControllerTupple(ControllerA2, 'action2'),
      ]);
    });

    test('many handlers data passed and registered', () => {
      @controller('')
      class ControllerA1 {
        @reducer
        action1() {}
        @reducer
        action2 = () => {};
        @reducer
        action3(action: Action<string>) {}
      }
      @controller('')
      class ControllerA2 {
        @reducer
        async baction1() {}
        @reducer
        baction2 = (action: Action<number>) => {};
        @reducer
        baction3() {}
      }

      expectActionToControllers([
        makeActionControllerTupple(ControllerA1, 'action1'),
        makeActionControllerTupple(ControllerA1, 'action2'),
        makeActionControllerTupple(ControllerA1, 'action3'),
        makeActionControllerTupple(ControllerA2, 'baction1'),
        makeActionControllerTupple(ControllerA2, 'baction2'),
        makeActionControllerTupple(ControllerA2, 'baction3'),
      ]);
    });
  });
});
