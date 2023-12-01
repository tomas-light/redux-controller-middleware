import { makeActionType } from './makeActionType';

test('', () => {
  const output = makeActionType('UserController', 'loadUser');
  expect(output).toBe('User_loadUser');
});
