"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopAction = void 0;
/**
 * If the action has next actions in chain, this method stops them from dispatching
 * @example
 * dispatch(
 *   chainActions(
 *     createUser(newUser),
 *     inviteUserSomewhere(newUser),
 *   )
 * )
 *
 * const createUser = createReducer<{ user: User }>('createUser', async ({ action, container, dispatch }) => {
 *   const userApi = container?.resolve(UserApi);
 *   const response = await userApi?.create(action.payload.user);
 *   if (!response.ok) {
 *     stopAction(action); // we can't invite not created user, so we may skip all next actions in the chain
 *     return;
 *   }
 *
 *   dispatch(
 *     updateStoreSlice(UsersSlice)({
 *       usersList: usersList.concat(response.data),
 *     })
 *   );
 * });
 * */
function stopAction(appAction) {
    appAction.stopPropagation = true;
}
exports.stopAction = stopAction;
//# sourceMappingURL=stopAction.js.map