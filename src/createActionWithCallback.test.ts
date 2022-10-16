import { createAction } from './createAction';
import { createActionWithCallback } from './createActionWithCallback';

it('simple action', () => {
  const simpleActionType = 'SIMPLE_ACTION';
  const simpleAction = createAction(simpleActionType);

  const actionWithCallbackType = 'ACTION_WITH_CALLBACK';
  const actionWithCallback = createActionWithCallback(actionWithCallbackType)(
    () => simpleAction
  );

  expect(actionWithCallback.callbackAction!()).toEqual(simpleAction);
});
