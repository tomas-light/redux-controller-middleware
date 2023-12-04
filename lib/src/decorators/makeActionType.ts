/**
 * @example
 * makeActionType('UserController', 'load', '0123') // 'User_load__0123'
 * makeActionType(undefined, 'load', '457') // 'load__457'
 * */
export function makeActionType(parameters: {
  controllerName?: string | undefined;
  methodName: string;
  uniqueSalt?: string;
}) {
  const { controllerName, methodName, uniqueSalt } = parameters;

  let prefix = '';
  if (controllerName) {
    const simplifiedName = controllerName.replace('Controller', '');
    prefix = `${simplifiedName}_`;
  }

  const name = methodName ?? '';
  const salt = uniqueSalt ? `__${uniqueSalt}` : '';

  return `${prefix}${name}${salt}`;
}
