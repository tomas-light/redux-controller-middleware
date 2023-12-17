import { Action as ReduxAction } from 'redux';
import { DiContextType } from 'cheap-di-react';
import { AppAction } from '../AppAction.js';
declare function addContainerToAction(action: ReduxAction, diContext: DiContextType): ReduxAction | AppAction<any>;
export { addContainerToAction };
