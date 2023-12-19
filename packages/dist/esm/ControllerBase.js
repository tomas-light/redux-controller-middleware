var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ControllerBase_1;
import { inject } from 'cheap-di';
import { Middleware } from './middleware/index.js';
import { updateStoreSlice } from './updateStoreSlice.js';
let ControllerBase = ControllerBase_1 = class ControllerBase {
    storeSlice;
    dispatch;
    getState;
    constructor(middleware, storeSlice) {
        this.storeSlice = storeSlice;
        if (new.target === ControllerBase_1) {
            throw new Error('Cannot construct ControllerBase instance directly');
        }
        this.dispatch = middleware?.dispatch;
        this.getState = () => middleware?.getState();
    }
    updateStoreSlice(partialStore) {
        if (!this.storeSlice) {
            throw new Error('You have to pass storeSlice to ControllerBase\'s "super" to use "this.updateStoreSlice" method');
        }
        this.dispatch(updateStoreSlice(this.storeSlice)(partialStore));
    }
};
ControllerBase = ControllerBase_1 = __decorate([
    inject(Middleware)
], ControllerBase);
export { ControllerBase };
//# sourceMappingURL=ControllerBase.js.map