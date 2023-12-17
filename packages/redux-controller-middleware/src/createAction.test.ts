import { createAction } from './createAction.js';

it('simple action', () => {
  const actionType = 'MY_ACTION';
  const action = createAction(actionType);
  expect(action.type).toEqual(actionType);
});

it('plain payload', () => {
  const actionType = 'MY_ACTION';
  const payload = 123;
  const action = createAction(actionType, payload);
  expect(action.payload).toEqual(payload);
});

it('array payload', () => {
  const actionType = 'MY_ACTION';
  const payload = [123, 456];
  const action = createAction(actionType, payload);
  expect(action.payload).toEqual(payload);
});

it('object payload', () => {
  const actionType = 'MY_ACTION';
  const payload = {
    some: 'qwe',
    some2: 123,
  };
  const action = createAction(actionType, payload);
  expect(action.payload).toEqual(payload);
});
