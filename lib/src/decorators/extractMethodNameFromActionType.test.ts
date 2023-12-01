import { extractMethodNameFromActionType } from './extractMethodNameFromActionType';

test('', () => {
  const output = extractMethodNameFromActionType('User_loadUser', 'UserController');
  expect(output).toBe('loadUser');
});
