import type { Action as ReduxAction } from 'redux';
import { AppAction } from '../actions/index.js';
import { type ActionMaybeWithContainer, isAction } from '../types/index.js';
import { addContainerToAction } from './addContainerToAction.js';

const myContainer = {} as any;

test('if action is not changed, because there is no container', () => {
  const actionType = 'test-action';
  const someData = [1, 2, 3];

  const action = { type: actionType, someData } as ReduxAction;
  const newAction = addContainerToAction(action, { container: undefined });

  expect(newAction).toBe(action);
});

describe('AppAction', () => {
  test('if action instance the same', () => {
    const actionType = 'test-action';
    const someData = [1, 2, 3];

    const action = new AppAction(actionType, { someData });
    const newAction = addContainerToAction(action, { container: myContainer }) as ActionMaybeWithContainer;

    expect(newAction).toBe(action);
  });

  test('if container is assigned to AppAction', () => {
    const actionType = 'test-action';
    const someData = [1, 2, 3];

    const action = new AppAction(actionType, { someData });
    const newAction = addContainerToAction(action, { container: myContainer }) as ActionMaybeWithContainer;

    expect(newAction.container).toBe(myContainer);
  });
});

describe('another action type', () => {
  test('if here is Action created', () => {
    const actionType = 'test-action';
    const someData = [1, 2, 3];

    const action = { type: actionType, someData } as ReduxAction;
    const newAction = addContainerToAction(action, { container: myContainer }) as ActionMaybeWithContainer;

    expect(isAction(newAction)).toBeTruthy();
  });

  test('if action type is kept', () => {
    const actionType = 'test-action';
    const someData = [1, 2, 3];

    const action = { type: actionType, someData } as ReduxAction;
    const newAction = addContainerToAction(action, { container: myContainer }) as ActionMaybeWithContainer;

    expect(newAction.type).toBe(actionType);
  });

  test('if action payload is passed correctly', () => {
    const actionType = 'test-action';
    const someData = [1, 2, 3];

    const action = { type: actionType, someData } as ReduxAction;
    const newAction = addContainerToAction(action, { container: myContainer }) as ActionMaybeWithContainer<{
      someData: number[];
    }>;

    expect(newAction.payload.someData).toBe(someData);
  });
});
