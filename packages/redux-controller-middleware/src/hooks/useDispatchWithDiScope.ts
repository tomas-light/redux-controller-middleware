import { useDiContext } from 'cheap-di-react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addContainerToAction } from './addContainerToAction.js';

/**
 * Warning! it is experimental hook, we don't recommend to use it
 * adds current container scope (from React.Context) to dispatched action to resolve all dependencies from its scope
 * */
export function useDispatchWithDiScope() {
  const dispatch = useDispatch();
  const diContext = useDiContext();

  const dispatchWithContainerScope = useCallback<typeof dispatch>(
    (action) => {
      const newAction = addContainerToAction(action, diContext);
      return dispatch(newAction) as any;
    },
    [dispatch, diContext.container]
  );

  return dispatchWithContainerScope;
}
