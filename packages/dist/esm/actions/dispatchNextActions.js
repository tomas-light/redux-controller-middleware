import { actionPromises } from '../actionPromises.js';
import { AppAction } from './index.js';
import { isAction } from '../types/index.js';
export async function dispatchNextActions(middlewareAPI, action) {
    const nextActions = [...AppAction.getActions(action)];
    while (nextActions.length) {
        const nextActionOrFactory = nextActions.shift();
        let nextAction;
        if (typeof nextActionOrFactory === 'function') {
            try {
                // callback or action factory
                nextAction = await nextActionOrFactory();
            }
            catch (error) {
                console.error('Unhandled exception in callback or action factory', error);
                // if there is something went wrong, we cannot proceed as normal,
                // because some user flow may be broken
                break;
            }
        }
        else {
            nextAction = nextActionOrFactory;
        }
        if (!isAction(nextAction)) {
            // if it was just callback, no need additional processing
            continue;
        }
        const promise = actionPromises.add(nextAction);
        middlewareAPI.dispatch(nextAction);
        await promise;
        if (nextAction.stopPropagation) {
            break;
        }
    }
}
//# sourceMappingURL=dispatchNextActions.js.map