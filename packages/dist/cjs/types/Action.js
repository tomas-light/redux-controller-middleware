"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAction = void 0;
function isAction(action) {
    if (typeof action !== 'object' || action == null) {
        return false;
    }
    const actionKeys = [
        //
        'type',
        'actions',
        'payload',
        'stopPropagation',
    ];
    const allKeysPresented = actionKeys.every((key) => key in action);
    return allKeysPresented;
}
exports.isAction = isAction;
//# sourceMappingURL=Action.js.map