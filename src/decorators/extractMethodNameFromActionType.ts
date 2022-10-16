/** 'MyController_findSelectedItem' => 'findSelectedItem' */
export function extractMethodNameFromActionType(actionType: string, constructorName: string) {
  const nameWithoutPostfix = constructorName.replace('Controller', '');
  return actionType.replace(`${nameWithoutPostfix}_`, '');
}
