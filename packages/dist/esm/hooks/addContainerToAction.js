import { AppAction } from '../AppAction.js';
import { createAction } from '../createAction.js';
function addContainerToAction(action, diContext) {
    if (!diContext.container) {
        return action;
    }
    if (action instanceof AppAction) {
        action.container = diContext.container;
        return action;
    }
    const newAction = createAction(action.type, {});
    for (const [key, value] of Object.entries(action)) {
        if (key !== ('type')) {
            newAction.payload[key] = value;
        }
    }
    return newAction;
}
export { addContainerToAction };
//# sourceMappingURL=addContainerToAction.js.map