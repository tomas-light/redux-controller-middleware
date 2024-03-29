import type { MiddlewareAPI } from 'redux';
import { chainActions, createAction, stopAction } from '../actions/index.js';
import { actionToControllerMap } from '../constants.js';
import { ControllerBase } from '../ControllerBase.js';
import { makeActionType } from '../actions/makeActionType.js';
import { isAction } from '../types/index.js';
import { controllerMiddleware } from './controllerMiddleware.js';

const ACTIONS = {
  actionA1: makeActionType({ controllerName: 'A', methodName: 'method1' }),
  actionA2: makeActionType({ controllerName: 'A', methodName: 'method2' }),
  actionA3: makeActionType({ controllerName: 'A', methodName: 'method3' }),

  actionB1: makeActionType({ controllerName: 'B', methodName: 'method1' }),
  actionB2: makeActionType({ controllerName: 'B', methodName: 'method2' }),
  actionB3: makeActionType({ controllerName: 'B', methodName: 'method3' }),
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
  const next = jest.fn((action: unknown) => {
    if (isAction(action)) {
      nextCalled.push(action.type);
    }
  }) as (action: unknown) => unknown;

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
      new Map([[ControllerA, methodName]])
    );

    actionToControllerMap.set(
      makeActionType({
        controllerName: 'B',
        methodName,
      }),
      new Map([[ControllerB, methodName]])
    );
  });

  const middleware = controllerMiddleware();
  const _middleware = middleware({
    dispatch: (action) => handleAction(action) as typeof action,
    getState(): unknown {
      return undefined;
    },
  });
  const handleAction = _middleware(next);

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
    return chainActions(
      //
      createAction(ACTIONS.actionA1),
      createAction(ACTIONS.actionA2),
      () => createAction(ACTIONS.actionB1)
    );
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
    const bAction = chainActions(
      //
      createAction(ACTIONS.actionB1),
      createAction(ACTIONS.actionB2),
      createAction(ACTIONS.actionB3)
    );
    stopAction(bAction);

    return chainActions(
      //
      createAction(ACTIONS.actionA1),
      createAction(ACTIONS.actionA2),
      bAction,
      () => createAction(ACTIONS.actionA3)
    );
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
    const bAction = chainActions(
      //
      createAction(ACTIONS.actionB1),
      createAction(ACTIONS.actionB2),
      createAction(ACTIONS.actionB3)
    );

    return chainActions(
      //
      createAction(ACTIONS.actionA1),
      createAction(ACTIONS.actionA2),
      bAction,
      () => createAction(ACTIONS.actionA3)
    );
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
    return chainActions(
      createAction(ACTIONS.actionA1),
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
