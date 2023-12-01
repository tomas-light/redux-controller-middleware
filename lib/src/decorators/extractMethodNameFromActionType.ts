/** 'MyController_findSelectedItem' => 'findSelectedItem' */
export function extractMethodNameFromActionType<T extends {}>(actionType: string, constructorName: string) {
  const nameWithoutPostfix = constructorName.replace('Controller', '');
  return actionType.replace(`${nameWithoutPostfix}_`, '') as keyof T;
}
