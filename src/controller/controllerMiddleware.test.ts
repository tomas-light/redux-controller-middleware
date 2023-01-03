import { AnyAction, Dispatch } from 'redux';
import { createAction } from '../createAction';
import { Action } from '../types';
import { ControllerBase } from './ControllerBase';
import { controllerMiddleware } from './controllerMiddleware';
import { watcher } from './Watcher';

const ACTIONS = {
	actionA1: 'ACTION_A_1',
	actionA2: 'ACTION_A_2',
	actionA3: 'ACTION_A_3',

	actionB1: 'ACTION_B_1',
	actionB2: 'ACTION_B_2',
	actionB3: 'ACTION_B_3',
};

class _Controller extends ControllerBase<any> {
	calledMethods: string[] = [];
	kind: string = '';

	method1() {
		this.calledMethods.push(`${this.kind}1`);
	}

	method2() {
		this.calledMethods.push(`${this.kind}2`);
	}

	method3() {
		this.calledMethods.push(`${this.kind}3`);
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, 500);
		});
	}
}

function makeMiddleware(calledMethods: string[]) {
	class ControllerA extends _Controller {
		calledMethods = calledMethods;
		kind = 'A';
	}

	class ControllerB extends _Controller {
		calledMethods = calledMethods;
		kind = 'B';
	}

	const watchersA = watcher<keyof ControllerA>(ControllerA, {
		[ACTIONS.actionA1]: 'method1',
		[ACTIONS.actionA2]: 'method2',
		[ACTIONS.actionA3]: 'method3',
	});
	const watchersB = watcher<keyof ControllerB>(ControllerB, {
		[ACTIONS.actionB1]: 'method1',
		[ACTIONS.actionB2]: 'method2',
		[ACTIONS.actionB3]: 'method3',
	});

	return controllerMiddleware({ watchers: [watchersA, watchersB] });
}

test('simple action', async () => {
	const calledMethods: string[] = [];
	const nextCalled: string[] = [];
	const next = jest.fn((action: AnyAction) => {
		nextCalled.push(action.type);
	}) as Dispatch;

	const middleware = makeMiddleware(calledMethods);
	const handleAction = middleware({} as any)(next);

	const simpleAction = createAction(ACTIONS.actionA1);
	await handleAction(simpleAction);
	expect(nextCalled.length).toBe(1);
	expect(nextCalled[0]).toBe(ACTIONS.actionA1);

	expect(calledMethods.length).toBe(1);
	expect(calledMethods[0]).toBe('A1');
});

test('2 simple actions', async () => {
	const calledMethods: string[] = [];
	const nextCalled: string[] = [];
	const next = jest.fn((action: Action) => {
		nextCalled.push(action.type);
	}) as Dispatch;

	const middleware = makeMiddleware(calledMethods);
	const handleAction = middleware({} as any)(next);

	const simpleAction1 = createAction(ACTIONS.actionA1);
	const simpleAction2 = createAction(ACTIONS.actionB1);
	await Promise.all([handleAction(simpleAction1), handleAction(simpleAction2)]);

	expect(nextCalled.length).toBe(2);
	expect(nextCalled[0]).toBe(ACTIONS.actionA1);
	expect(nextCalled[1]).toBe(ACTIONS.actionB1);

	expect(calledMethods.length).toBe(2);
	expect(calledMethods[0]).toBe('A1');
	expect(calledMethods[1]).toBe('B1');
});

test('3 consistent actions', async () => {
	const calledMethods: string[] = [];

	const nextCalled: string[] = [];
	const next = jest.fn((action: Action) => {
		nextCalled.push(action.type);
	}) as Dispatch;

	const middleware = makeMiddleware(calledMethods);
	const handleAction = middleware({} as any)(next);

	const action = createAction(ACTIONS.actionA1);
	action.addNextActions(
		//
		createAction(ACTIONS.actionA2),
		() => createAction(ACTIONS.actionB1)
	);

	await handleAction(action);
	expect(calledMethods).toStrictEqual([
		//
		'A1',
		'A2',
		'B1',
	]);

	expect(nextCalled.length).toBe(1);
});

test('3 consistent actions with promises', async () => {
	const calledMethods: string[] = [];

	const nextCalled: string[] = [];
	const next = jest.fn((action: Action) => {
		nextCalled.push(action.type);
	}) as Dispatch;

	const middleware = makeMiddleware(calledMethods);
	const handleAction = middleware({} as any)(next);

	const action = createAction(ACTIONS.actionA1);
	action.addNextActions(
		//
		() => createAction(ACTIONS.actionA3),
		createAction(ACTIONS.actionA2)
	);

	await handleAction(action);
	expect(calledMethods).toStrictEqual([
		//
		'A1',
		'A3',
		'A2',
	]);

	expect(nextCalled.length).toBe(1);
});

test('5 consistent actions with promises and stop propagation', async () => {
	const calledMethods: string[] = [];

	const nextCalled: string[] = [];
	const next = jest.fn((action: Action) => {
		nextCalled.push(action.type);
	}) as Dispatch;

	const middleware = makeMiddleware(calledMethods);
	const handleAction = middleware({} as any)(next);

	const action = createAction(ACTIONS.actionA1);

	const bAction = createAction(ACTIONS.actionB1);
	bAction.stop();
	bAction.addNextActions(createAction(ACTIONS.actionB2), createAction(ACTIONS.actionB3));

	action.addNextActions(createAction(ACTIONS.actionA2), bAction, () => createAction(ACTIONS.actionA3));

	await handleAction(action);
	expect(calledMethods).toStrictEqual([
		//
		'A1',
		'A2',
		'B1',
		'A3',
	]);

	expect(nextCalled.length).toBe(1);
});

// describe('check of asynchronous controller methods execution', () => {
// 	class Controller extends ControllerBase<any> {
// 		action1(action: Action<{ callback: () => void }>) {
// 			action.payload.callback();
// 		}
// 	}
//
// 	const actionType = 'action type 1';
//
// 	const watchers = watcher<keyof Controller>(Controller, [[actionType, 'action1']]);
//
// 	const middleware = controllerMiddleware({ watchers: [watchers] });
// 	const next = (action: any) => ({} as any);
// 	const handleAction = middleware({} as any)(next);
//
// 	test('controller method execution is asynchronous, so it modify array after all', async () => {
// 		const array = ['initial string'];
//
// 		const action = createAction<{ callback: () => void }>(actionType, {
// 			callback: () => {
// 				array.push('string from the controller method');
// 			},
// 		});
//
// 		await handleAction(action);
//
// 		array.push('string after action dispatched');
//
// 		expect(array).toStrictEqual([
// 			'initial string',
// 			'string from the controller method',
// 			'string after action dispatched',
// 		]);
// 	});
// });
