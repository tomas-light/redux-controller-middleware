import { makeActionType } from './makeActionType';

describe('[function] makeActionType', () => {
  test('controller name + method name + salt', () => {
    const output = makeActionType({
      controllerName: 'UserController',
      methodName: 'loadUser',
      uniqueSalt: '123',
    });
    expect(output).toBe('User_loadUser__123');
  });

  test('controller name + method name', () => {
    const output = makeActionType({
      controllerName: 'UserController',
      methodName: 'loadUser',
    });
    expect(output).toBe('User_loadUser');
  });

  test('method name', () => {
    const output = makeActionType({
      methodName: 'loadUser',
    });
    expect(output).toBe('loadUser');
  });
});
