import { AnyAction, Dispatch } from 'redux';
import { createAction } from '../createAction';
import { Action } from '../types';
import { ControllerBase } from './ControllerBase';
import { controllerMiddleware } from './controllerMiddleware';
import { watcher } from './watcher';

const ACTIONS = {
  actionA1: 'ACTION_A_1',
  actionA2: 'ACTION_A_2',
  actionA3: 'ACTION_A_3',

  actionB1: 'ACTION_B_1',
  actionB2: 'ACTION_B_2',
  actionB3: 'ACTION_B_3',
};

class _Controller extends ControllerBase<any> {
  calledMethods: string[] = [];
  kind: string = '';

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

function makeMiddleware(calledMethods: string[], next: Dispatch<AnyAction>) {
  class ControllerA extends _Controller {
    calledMethods = calledMethods;
    kind = 'A';
  }

  class ControllerB extends _Controller {
    calledMethods = calledMethods;
    kind = 'B';
  }

  const watchersA = watcher(ControllerA, {
    [ACTIONS.actionA1]: 'method1',
    [ACTIONS.actionA2]: 'method2',
    [ACTIONS.actionA3]: 'method3',
  });
  const watchersB = watcher(ControllerB, {
    [ACTIONS.actionB1]: 'method1',
    [ACTIONS.actionB2]: 'method2',
    [ACTIONS.actionB3]: 'method3',
  });

  const middleware = controllerMiddleware({ watchers: [watchersA, watchersB] });
  const handleAction = middleware({
    dispatch: (action: Action<any>) => handleAction(action),
  } as any)(next);
  return handleAction;
}

describe('simple action', () => {
  const calledMethods: string[] = [];
  const nextCalled: string[] = [];
  const next = jest.fn((action: AnyAction) => {
    nextCalled.push(action.type);
  }) as Dispatch;

  const handleAction = makeMiddleware(calledMethods, next);

  beforeEach(() => {
    calledMethods.splice(0, calledMethods.length);
    nextCalled.splice(0, nextCalled.length);
  });

  test('if "next" was called one time', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    await handleAction(simpleAction);
    expect(nextCalled.length).toBe(1);
  });
  test('if "next" was called with correct action', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    await handleAction(simpleAction);
    expect(nextCalled[0]).toBe(ACTIONS.actionA1);
  });

  test('if one method of the controller was called', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    await handleAction(simpleAction);
    expect(calledMethods.length).toBe(1);
  });
  test('if method of the controller was called with the passed action', async () => {
    const simpleAction = createAction(ACTIONS.actionA1);
    await handleAction(simpleAction);
    expect(calledMethods[0]).toBe('A1');
  });
});

describe('2 simple actions', () => {
  const calledMethods: string[] = [];
  const nextCalled: string[] = [];
  const next = jest.fn((action: Action) => {
    nextCalled.push(action.type);
  }) as Dispatch;

  beforeEach(() => {
    calledMethods.splice(0, calledMethods.length);
    nextCalled.splice(0, nextCalled.length);
  });

  const handleAction = makeMiddleware(calledMethods, next);

  test('if "next" was called two times', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(nextCalled.length).toBe(2);
  });
  test('if "next" was called with correct action', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(nextCalled).toEqual([ACTIONS.actionA1, ACTIONS.actionB1]);
  });

  test('if two methods of the controller were called', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(calledMethods.length).toBe(2);
  });
  test('if methods of the controller were called with the passed action', async () => {
    const simpleAction1 = createAction(ACTIONS.actionA1);
    const simpleAction2 = createAction(ACTIONS.actionB1);
    await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);
    expect(calledMethods).toEqual(['A1', 'B1']);
  });
});

describe('3 consistent actions', () => {
  const calledMethods: string[] = [];

  const nextCalled: string[] = [];
  const next = jest.fn((action: Action) => {
    nextCalled.push(action.type);
  }) as Dispatch;

  const handleAction = makeMiddleware(calledMethods, next);

  beforeEach(() => {
    calledMethods.splice(0, calledMethods.length);
    nextCalled.splice(0, nextCalled.length);
  });

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
    await handleAction(action);
    expect(nextCalled.length).toBe(3);
  });
  test('if "next" was called with correct action', async () => {
    const action = prepareAction();
    await handleAction(action);
    expect(nextCalled).toEqual([ACTIONS.actionA1, ACTIONS.actionA2, ACTIONS.actionB1]);
  });

  test('if three methods of the controller were called', async () => {
    const action = prepareAction();
    await handleAction(action);
    expect(calledMethods.length).toBe(3);
  });
  test('if methods of the controller were called with the passed action', async () => {
    const action = prepareAction();
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
  const calledMethods: string[] = [];

  const nextCalled: string[] = [];
  const next = jest.fn((action: Action) => {
    nextCalled.push(action.type);
  }) as Dispatch;

  beforeEach(() => {
    calledMethods.splice(0, calledMethods.length);
    nextCalled.splice(0, nextCalled.length);
  });

  const handleAction = makeMiddleware(calledMethods, next);

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
    await handleAction(action);
    expect(nextCalled.length).toBe(3);
  });
  test('if "next" was called with correct action', async () => {
    const action = prepareAction();
    await handleAction(action);
    expect(nextCalled).toEqual([ACTIONS.actionA1, ACTIONS.actionA2, ACTIONS.actionB1]);
  });

  test('if methods of the controller were called with the passed action', async () => {
    const action = prepareAction();
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
  const calledMethods: string[] = [];

  const nextCalled: string[] = [];
  const next = jest.fn((action: Action) => {
    nextCalled.push(action.type);
  }) as Dispatch;

  beforeEach(() => {
    calledMethods.splice(0, calledMethods.length);
    nextCalled.splice(0, nextCalled.length);
  });

  const handleAction = makeMiddleware(calledMethods, next);

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
    await handleAction(action);
    expect(nextCalled.length).toBe(6);
  });

  test('if order of called methods is correct', async () => {
    const action = prepareAction();
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
  const calledMethods: string[] = [];

  const nextCalled: string[] = [];
  const next = jest.fn((action: Action) => {
    nextCalled.push(action.type);
  }) as Dispatch;

  const mockFn1 = jest.fn(() => {
    calledMethods.push('mock fn 1');
  });
  const mockFn2 = jest.fn(() => {
    calledMethods.push('mock fn 2');
  });
  const mockAsyncFn = jest.fn(async () => {
    calledMethods.push('mock async fn is called');
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 50);
    });
    calledMethods.push('mock async fn has done');
  });

  beforeEach(() => {
    calledMethods.splice(0, calledMethods.length);
    nextCalled.splice(0, nextCalled.length);
    mockFn1.mockClear();
    mockFn2.mockClear();
    mockAsyncFn.mockClear();
  });

  const handleAction = makeMiddleware(calledMethods, next);

  function prepareAction() {
    const action = createAction(ACTIONS.actionA1);

    action.addNextActions(
      //
      createAction(ACTIONS.actionA2),
      mockFn1,
      mockAsyncFn,
      () => createAction(ACTIONS.actionA3),
      mockFn2
    );

    return action;
  }

  test('if "next" was called three times', async () => {
    const action = prepareAction();
    await handleAction(action);
    expect(nextCalled.length).toBe(3);
  });

  test('if order of called methods is correct', async () => {
    const action = prepareAction();
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
