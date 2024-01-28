import type { Action } from '../types/index.js';
import { chainActions, FALLBACK_ACTION_TYPE, FIRST_ACTION_IN_CHAIN_TYPE } from './chainActions.js';
import { createAction } from './createAction.js';

describe('if null or undefined', () => {
  test(`it returns action with type ${FALLBACK_ACTION_TYPE}`, () => {
    const action = chainActions();
    expect(action.type).toBe(FALLBACK_ACTION_TYPE);
  });
});

// we cannot chain actions that are not matches with our interface
describe('if passed not redux-controller actions', () => {
  test(`it returns action with type ${FALLBACK_ACTION_TYPE}`, () => {
    const notAppAction = { type: 'not app action' } as Action;
    const action = chainActions(notAppAction);
    expect(action.type).toBe(FALLBACK_ACTION_TYPE);
  });

  test(`it returns action with type ${FALLBACK_ACTION_TYPE}`, () => {
    const notAppAction = { something: 123 } as any;
    const action = chainActions(notAppAction);
    expect(action.type).toBe(FALLBACK_ACTION_TYPE);
  });
});

describe('if passed one action', () => {
  const action1 = createAction('my action 1');

  test('it returns the same action', () => {
    const action = chainActions(action1);
    expect(action).toBe(action1);
  });

  test('returned action does not contain callback actions', () => {
    const action = chainActions(action1);
    expect(action.actions).toEqual([]);
  });
});

describe('if passed multiple actions', () => {
  function prepareActions() {
    const action1 = createAction('my action 1');
    const action2 = createAction('my action 2');
    const action3 = createAction('my action 3');
    return {
      action1,
      action2,
      action3,
    };
  }

  test('if first action is reserved action in case, when not an action was passed as first argument', () => {
    const { action1, action2, action3 } = prepareActions();
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const action = chainActions(mockFn1, action1, action2, mockFn2, action3);

    expect(action.type).toBe(FIRST_ACTION_IN_CHAIN_TYPE);
  });

  test('if first action is the first passed action', () => {
    const { action1, action2, action3 } = prepareActions();
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const action = chainActions(action1, mockFn1, action2, mockFn2, action3);

    expect(action.type).toBe(action1.type);
  });

  test('if actions order keep the original order', () => {
    const { action1, action2, action3 } = prepareActions();
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const action = chainActions(action1, mockFn1, action2, mockFn2, action3);

    const actionFactories = action.actions;
    expect(actionFactories).toEqual([mockFn1, action2, mockFn2, action3]);
  });
});
