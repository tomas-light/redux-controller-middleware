import { AppAction } from './AppAction';
import { chainActions, FALLBACK_ACTION_TYPE } from './chainActions';
import { createAction } from './createAction';
import { Action } from './types';

describe('if null or undefined', () => {
	test(`it returns action with type ${FALLBACK_ACTION_TYPE}`, () => {
		const action = chainActions();
		expect(action.type).toBe(FALLBACK_ACTION_TYPE);
	});
});

describe('if passed not actions', () => {
	const notAppAction = { type: 'not app action' } as Action;

	test(`it returns action with type ${FALLBACK_ACTION_TYPE}`, () => {
		const action = chainActions(notAppAction);
		expect(action.type).toBe(FALLBACK_ACTION_TYPE);
	});
});

describe('if passed one action', () => {
	const action1 = createAction('my action 1');

	test('it returns the same action', () => {
		const action = chainActions(action1);
		expect(action).toBe(action1);
	});

	test('returned action does not contain callback actions', () => {
		const action = chainActions(action1);
		expect(action.actions).toEqual([]);
	});
});

describe('if passed multiple actions', () => {
	const action1 = createAction('my action 1');
	const action2 = createAction('my action 2');
	const action3 = createAction('my action 3');

	test('it returns the first action', () => {
		const action = chainActions(action1, action2, action3);
		expect(action).toBe(action1);
	});

	test('there is a valid action chain', () => {
		const action = chainActions(action1, action2, action3);

		const nextAction1 = AppAction.getActions(action)[0]();
		expect(nextAction1.type).toBe(action2.type);

		const nextAction2 = AppAction.getActions(nextAction1)[0]();
		expect(nextAction2.type).toBe(action3.type);
	});
});
