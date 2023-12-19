/**
 * this class is needed to be able to resolve redux middleware via DI,
 * class is used as a token for such resolving
 */
export class Middleware {
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
//# sourceMappingURL=Middleware.js.map