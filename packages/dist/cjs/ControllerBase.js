"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ControllerBase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerBase = void 0;
const cheap_di_1 = require("cheap-di");
const index_js_1 = require("./middleware/index.js");
const updateStoreSlice_js_1 = require("./updateStoreSlice.js");
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
        this.dispatch((0, updateStoreSlice_js_1.updateStoreSlice)(this.storeSlice)(partialStore));
    }
};
exports.ControllerBase = ControllerBase;
exports.ControllerBase = ControllerBase = ControllerBase_1 = __decorate([
    (0, cheap_di_1.inject)(index_js_1.Middleware)
], ControllerBase);
//# sourceMappingURL=ControllerBase.js.map