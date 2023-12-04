import { actionToControllerMap, ControllerInfo } from '../constants';
import { Action } from '../types';
import { reducer } from './reducer';
import { reduxController } from './reduxController';

describe('[function] reduxController', () => {
  beforeEach(() => {
    actionToControllerMap.clear();
  });

  describe('single controller', () => {
    test('one handler data passed and registered', () => {
      @reduxController('')
      class TestController {
        @reducer
        action1() {}
      }

      expect(Array.from(actionToControllerMap.entries())).toEqual([
        [
          'Test_action1',
          {
            controllerConstructor: TestController,
            methodName: 'action1',
          } satisfies ControllerInfo,
        ],
      ]);
    });

    test('many handlers data passed and registered', () => {
      @reduxController('')
      class Test {
        @reducer
        action1() {}
        @reducer
        action2() {}
        @reducer
        action3() {}
      }

      expect(Array.from(actionToControllerMap.entries())).toEqual([
        [
          'Test_action1',
          {
            controllerConstructor: Test,
            methodName: 'action1',
          } satisfies ControllerInfo,
        ],
        [
          'Test_action2',
          {
            controllerConstructor: Test,
            methodName: 'action2',
          } satisfies ControllerInfo,
        ],
        [
          'Test_action3',
          {
            controllerConstructor: Test,
            methodName: 'action3',
          } satisfies ControllerInfo,
        ],
      ]);
    });
  });

  describe('two controllers', () => {
    test('one handler data passed and registered', () => {
      @reduxController('')
      class ControllerA1 {
        @reducer
        action1() {}
      }
      @reduxController('')
      class ControllerA2 {
        @reducer
        action1() {}
      }

      expect(Array.from(actionToControllerMap.entries())).toEqual([
        [
          'A1_action1',
          {
            controllerConstructor: ControllerA1,
            methodName: 'action1',
          } satisfies ControllerInfo,
        ],
        [
          'A2_action1',
          {
            controllerConstructor: ControllerA2,
            methodName: 'action1',
          } satisfies ControllerInfo,
        ],
      ]);
    });

    test('many handlers data passed and registered', () => {
      @reduxController('')
      class ControllerA1 {
        @reducer
        action1() {}
        @reducer
        action2 = (a: string) => {};
        @reducer
        action3(action: Action<string>) {}
      }
      @reduxController('')
      class ControllerA2 {
        @reducer
        async baction1() {}
        @reducer
        baction2 = (action: Action) => {};
        @reducer
        baction3() {}
      }

      const sortKeys = (left: [string, ControllerInfo], right: [string, ControllerInfo]) => {
        return left[0] > right[0] ? 1 : -1;
      };

      // todo: improve code

      expect(Array.from(actionToControllerMap.entries()).sort(sortKeys)).toEqual(
        [
          [
            'A1_action1',
            {
              controllerConstructor: ControllerA1,
              methodName: 'action1',
            } satisfies ControllerInfo,
          ] as [string, ControllerInfo],
          [
            'A1_action2',
            {
              controllerConstructor: ControllerA1,
              methodName: 'action2',
            } satisfies ControllerInfo,
          ] as [string, ControllerInfo],
          [
            'A1_action3',
            {
              controllerConstructor: ControllerA1,
              methodName: 'action3',
            } satisfies ControllerInfo,
          ] as [string, ControllerInfo],
          [
            'A2_baction1',
            {
              controllerConstructor: ControllerA2,
              methodName: 'baction1',
            } satisfies ControllerInfo,
          ] as [string, ControllerInfo],
          [
            'A2_baction2',
            {
              controllerConstructor: ControllerA2,
              methodName: 'baction2',
            } satisfies ControllerInfo,
          ] as [string, ControllerInfo],
          [
            'A2_baction3',
            {
              controllerConstructor: ControllerA2,
              methodName: 'baction3',
            } satisfies ControllerInfo,
          ] as [string, ControllerInfo],
        ].sort(sortKeys)
      );
    });
  });
});
