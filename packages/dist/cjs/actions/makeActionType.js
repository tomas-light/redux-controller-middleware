"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeActionType = void 0;
/**
 * @example
 * makeActionType('UserController', 'load', '0123') // 'User_load__0123'
 * makeActionType(undefined, 'load', '457') // 'load__457'
 * */
function makeActionType(parameters) {
    const { controllerName, methodName, uniqueSalt } = parameters;
    let prefix = '';
    if (controllerName) {
        const simplifiedName = controllerName.replace('Controller', '');
        prefix = `${simplifiedName[0].toLowerCase() + simplifiedName.slice(1)} / `;
    }
    const name = methodName ?? '';
    const salt = uniqueSalt ? `  ${uniqueSalt}` : '';
    return `${prefix}${name}${salt}`;
}
exports.makeActionType = makeActionType;
//# sourceMappingURL=makeActionType.js.map