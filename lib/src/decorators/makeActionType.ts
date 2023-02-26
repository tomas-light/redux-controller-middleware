/** ('MyController', 'findSelectedItem') => 'MyController_findSelectedItem' */
export function makeActionType(constructorName: string, actionTypeOrProperty: string) {
  return `${constructorName.replace('Controller', '')}_${actionTypeOrProperty}`;
}
