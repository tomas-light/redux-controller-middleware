export class AppAction {
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
    static stop(appAction) {
        appAction.stopPropagation = true;
    }
    static getActions(appAction) {
        if (!Array.isArray(appAction.actions)) {
            return [];
        }
        return appAction.actions;
    }
    addNextActions(...actions) {
        AppAction.addNextActions(this, ...actions);
        return this;
    }
    stop() {
        AppAction.stop(this);
    }
    toPlainObject() {
        const keys = Object.keys(this);
        const plainObject = {};
        keys.forEach((key) => {
            // skip property
            if (key === 'toPlainObject') {
                return;
            }
            if (key === 'actions') {
                plainObject[key] = this[key];
                return;
            }
            if (key === 'stopPropagation') {
                plainObject[key] = this[key];
                return;
            }
            plainObject[key] = this[key];
        });
        plainObject.addNextActions = function (...actions) {
            return AppAction.addNextActions(this, ...actions);
        };
        plainObject.stop = function () {
            AppAction.stop(this);
        };
        plainObject.getActions = function () {
            return AppAction.getActions(this);
        };
        return plainObject;
    }
}
//# sourceMappingURL=AppAction.js.map