import { useDiContext } from 'cheap-di-react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addContainerToAction } from './addContainerToAction';

/** Warning! it is experimental hook, we don't recommend to use it */
function useDispatchWithDiScope() {
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

export { useDispatchWithDiScope };
