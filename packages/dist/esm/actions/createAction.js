import { AppAction } from './AppAction.js';
export function createAction(actionType, payload) {
    let normalizedPayload;
    if (typeof payload === 'object' && !Array.isArray(payload)) {
        normalizedPayload = { ...payload };
    }
    else {
        normalizedPayload = payload;
    }
    return new AppAction(actionType, normalizedPayload).toPlainObject();
}
//# sourceMappingURL=createAction.js.map