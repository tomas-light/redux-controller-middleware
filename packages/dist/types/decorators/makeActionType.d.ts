/**
 * @example
 * makeActionType('UserController', 'load', '0123') // 'User_load__0123'
 * makeActionType(undefined, 'load', '457') // 'load__457'
 * */
export declare function makeActionType(parameters: {
    controllerName?: string | undefined;
    methodName: string;
    uniqueSalt?: string;
}): string;
