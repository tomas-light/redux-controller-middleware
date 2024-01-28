"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppAction = void 0;
class AppAction {
    type;
    payload;
    actions;
    stopPropagation;
    container;
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
        this.actions = [];
        this.stopPropagation = false;
    }
    static addNextActions(appAction, ...actions) {
        appAction.actions.push(...actions);
        return appAction;
    }
    static getActions(appAction) {
        if (!Array.isArray(appAction.actions)) {
            return [];
        }
        return appAction.actions;
    }
    toPlainObject() {
        const plainObject = Object.assign({}, this);
        delete plainObject.toPlainObject;
        return plainObject;
    }
}
exports.AppAction = AppAction;
//# sourceMappingURL=AppAction.js.map