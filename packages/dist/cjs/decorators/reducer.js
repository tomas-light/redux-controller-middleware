"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
const constants_js_1 = require("../constants.js");
/**
 * It marks your method as action handler, you have to use `@reduxController` decorator on the class as well,
 * to register this method in the middleware
 * */
exports.reducer = ((method, contextOrName) => {
    if (typeof contextOrName === 'string') {
        constants_js_1.methodNamesTemporaryBox.push(contextOrName);
        return;
    }
    if (typeof contextOrName.name === 'symbol') {
        throw new Error('Cannot decorate symbol names.');
    }
    switch (contextOrName.kind) {
        case 'field':
        case 'method':
            constants_js_1.methodNamesTemporaryBox.push(contextOrName.name);
            return method;
        case 'accessor':
        case 'class':
        case 'getter':
        case 'setter':
        default:
            throw new Error('Decorator can be used only for method and bounded methods (arrow function style)');
    }
});
//# sourceMappingURL=reducer.js.map