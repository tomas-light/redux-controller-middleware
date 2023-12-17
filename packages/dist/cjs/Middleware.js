"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
// this class is needed to be able to resolve redux middleware via DI
// class is used as a token for such resolving
class Middleware {
    constructor() {
        throw new Error('This class is just token for resolving Redux middleware via Dependency Injection. You should not to create it directly');
    }
    dispatch = () => {
        throw new Error('Not implemented');
    };
    getState() {
        throw new Error('Not implemented');
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map