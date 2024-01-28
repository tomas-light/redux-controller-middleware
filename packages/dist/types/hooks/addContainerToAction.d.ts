import type { DiContextType } from 'cheap-di-react';
import type { Action as ReduxAction } from 'redux';
import { AppAction } from '../actions/index.js';
declare function addContainerToAction(action: ReduxAction, diContext: DiContextType): ReduxAction | AppAction<any>;
export { addContainerToAction };
