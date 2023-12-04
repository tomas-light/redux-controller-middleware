import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { actionToControllerMap } from '../constants';
import { createAction } from '../createAction';
import { makeActionType } from '../decorators/makeActionType';
import { Action } from '../types';
import { ControllerBase } from './ControllerBase';
import { controllerMiddleware } from './controllerMiddleware';

const ACTIONS = {
  actionA1: 'A_method1',
  actionA2: 'A_method2',
  actionA3: 'A_method3',

  actionB1: 'B_method1',
  actionB2: 'B_method2',
  actionB3: 'B_method3',
};

class _Controller extends ControllerBase<any> {
  constructor(
    middlewareAPI: MiddlewareAPI,
    readonly calledMethods: string[],
    readonly kind: string
  ) {
    super(middlewareAPI);
  }

  method1() {
    this.calledMethods.push(`${this.kind}1`);
  }

  method2() {
    this.calledMethods.push(`${this.kind}2`);
  }

  method3() {
    this.calledMethods.push(`${this.kind}3`);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
}

function makeMiddleware() {
  const calledMethods: string[] = [];
  const nextCalled: string[] = [];
  const next = jest.fn((action: AnyAction) => {
    nextCalled.push(action.type);
  }) as Dispatch;

  actionToControllerMap.clear();

  class ControllerA extends _Controller {
    constructor(middlewareAPI: MiddlewareAPI) {
      super(middlewareAPI, calledMethods, 'A');
    }
  }

  class ControllerB extends _Controller {
    constructor(middlewareAPI: MiddlewareAPI) {
      super(middlewareAPI, calledMethods, 'B');
    }
  }

  ['method1', 'method2', 'method3'].forEach((methodName) => {
    actionToControllerMap.set(
      makeActionType({
        controllerName: 'A',
        methodName,
      }),
      {
        controllerConstructor: ControllerA,
        methodName,
      }
    );

    actionToControllerMap.set(
      makeActionType({
        controllerName: 'B',
        methodName,
      }),
      {
        controllerConstructor: ControllerB,
        methodName,
      }
    );
  });

  const middleware = controllerMiddleware();
  const handleAction = middleware({
    dispatch: (action: Action<any>) => handleAction(action),
  } as any)(next);

  return {
    calledMethods,
    nextCalled,
    handleAction,
  };
}

describe('simple action', () => {
  test('if "next" was called one time', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    const { handleAction, nextCalled } = makeMiddleware();
    await handleAction(simpleAction);
    expect(nextCalled.length).toBe(1);
  });
  test('if "next" was called with correct action', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    const { handleAction, nextCalled } = makeMiddleware();
    await handleAction(simpleAction);
    expect(nextCalled[0]).toBe(ACTIONS.actionA1);
  });

  test('if one method of the controller was called', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    const { handleAction, calledMethods } = makeMiddleware();
    await handleAction(simpleAction);
    expect(calledMethods.length).toBe(1);
  });
  test('if method of the controller was called with the passed action', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    const { handleAction, calledMethods } = makeMiddleware();
    await handleAction(simpleAction);
    expect(calledMethods[0]).toBe('A1');
  });
});

describe('2 simple actions', () => {
  test('if "next" was called two times', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);

    const { handleAction, nextCalled } = makeMiddleware();
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(nextCalled.length).toBe(2);
  });
  test('if "next" was called with correct action', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);

    const { handleAction, nextCalled } = makeMiddleware();
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(nextCalled).toEqual([ACTIONS.actionA1, ACTIONS.actionB1]);
  });

  test('if two methods of the controller were called', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);

    const { handleAction, calledMethods } = makeMiddleware();
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(calledMethods.length).toBe(2);
  });
  test('if methods of the controller were called with the passed action', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);

    const { handleAction, calledMethods } = makeMiddleware();
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(calledMethods).toEqual(['A1', 'B1']);
  });
});

describe('3 consistent actions', () => {
  function prepareAction() {
    const action = createAction(ACTIONS.actionA1);
    action.addNextActions(
      //
      createAction(ACTIONS.actionA2),
      () => createAction(ACTIONS.actionB1)
    );

    return action;
  }

  test('if "next" was called one time', async () => {
    const action = prepareAction();
    const { handleAction, nextCalled } = makeMiddleware();
    await handleAction(action);
    expect(nextCalled.length).toBe(3);
  });
  test('if "next" was called with correct action', async () => {
    const action = prepareAction();
    const { handleAction, nextCalled } = makeMiddleware();
    await handleAction(action);
    expect(nextCalled).toEqual([ACTIONS.actionA1, ACTIONS.actionA2, ACTIONS.actionB1]);
  });

  test('if three methods of the controller were called', async () => {
    const action = prepareAction();
    const { handleAction, calledMethods } = makeMiddleware();
    await handleAction(action);
    expect(calledMethods.length).toBe(3);
  });
  test('if methods of the controller were called with the passed action', async () => {
    const action = prepareAction();
    const { handleAction, calledMethods } = makeMiddleware();
    await handleAction(action);
    expect(calledMethods).toStrictEqual([
      //
      'A1',
      'A2',
      'B1',
    ]);
  });
});

describe('5 consistent actions with promises and stop propagation', () => {
  function prepareAction() {
    const action = createAction(ACTIONS.actionA1);

    const bAction = createAction(ACTIONS.actionB1);
    bAction.stop();
    bAction.addNextActions(createAction(ACTIONS.actionB2), createAction(ACTIONS.actionB3));

    action.addNextActions(
      //
      createAction(ACTIONS.actionA2),
      bAction,
      () => createAction(ACTIONS.actionA3)
    );

    return action;
  }

  test('if "next" was called one time', async () => {
    const action = prepareAction();
    const { handleAction, nextCalled } = makeMiddleware();
    await handleAction(action);
    expect(nextCalled.length).toBe(3);
  });
  test('if "next" was called with correct action', async () => {
    const action = prepareAction();
    const { handleAction, nextCalled } = makeMiddleware();
    await handleAction(action);
    expect(nextCalled).toEqual([ACTIONS.actionA1, ACTIONS.actionA2, ACTIONS.actionB1]);
  });

  test('if methods of the controller were called with the passed action', async () => {
    const action = prepareAction();
    const { handleAction, calledMethods } = makeMiddleware();
    await handleAction(action);
    expect(calledMethods).toStrictEqual([
      //
      'A1',
      'A2',
      'B1',
    ]);
  });
});

describe('many actions with nesting', () => {
  function prepareAction() {
    const action = createAction(ACTIONS.actionA1);
    const bAction = createAction(ACTIONS.actionB1);
    bAction.addNextActions(createAction(ACTIONS.actionB2), createAction(ACTIONS.actionB3));

    action.addNextActions(
      //
      createAction(ACTIONS.actionA2),
      bAction,
      () => createAction(ACTIONS.actionA3)
    );

    return action;
  }

  test('if "next" was called three times', async () => {
    const action = prepareAction();
    const { handleAction, nextCalled } = makeMiddleware();
    await handleAction(action);
    expect(nextCalled.length).toBe(6);
  });

  test('if order of called methods is correct', async () => {
    const action = prepareAction();
    const { handleAction, calledMethods } = makeMiddleware();
    await handleAction(action);
    expect(calledMethods).toStrictEqual([
      //
      'A1',
      'A2',
      'B1',
      'B2',
      'B3',
      'A3',
    ]);
  });
});

describe('many actions with callbacks', () => {
  function prepareAction(calledMethods: string[]) {
    const action = createAction(ACTIONS.actionA1);

    action.addNextActions(
      //
      createAction(ACTIONS.actionA2),
      jest.fn(() => {
        calledMethods.push('mock fn 1');
      }),
      jest.fn(async () => {
        calledMethods.push('mock async fn is called');
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 50);
        });
        calledMethods.push('mock async fn has done');
      }),
      () => createAction(ACTIONS.actionA3),
      jest.fn(() => {
        calledMethods.push('mock fn 2');
      })
    );

    return action;
  }

  test('if "next" was called three times', async () => {
    const { handleAction, nextCalled, calledMethods } = makeMiddleware();
    const action = prepareAction(calledMethods);
    await handleAction(action);
    expect(nextCalled.length).toBe(3);
  });

  test('if order of called methods is correct', async () => {
    const { handleAction, calledMethods } = makeMiddleware();
    const action = prepareAction(calledMethods);
    await handleAction(action);
    expect(calledMethods).toStrictEqual([
      'A1',
      'A2',
      'mock fn 1',
      'mock async fn is called',
      'mock async fn has done',
      'A3',
      'mock fn 2',
    ]);
  });
});
