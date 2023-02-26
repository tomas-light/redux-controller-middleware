import { Dispatch } from 'redux';
import { watch } from '../decorators';
import { Action, WatchedController } from '../types';
import { ControllerBase } from './ControllerBase';
import { controllerMiddleware } from './controllerMiddleware';

test('if callback actions will be dispatched only after main action is ended one by one', async () => {
	async function asyncOperation() {
		const randomNumber = Math.random();
		return await new Promise<number>((resolve) => {
			setTimeout(() => resolve(randomNumber), randomNumber * 1000);
		});
	}

	const callStack: string[] = [];

	@watch
	class Controller1 extends ControllerBase<any> {
		@watch
		async init() {
			callStack.push('1 start');
			await asyncOperation();
			callStack.push('1 end');

			this.dispatch(controller3.init());
		}
	}
	const controller1 = Controller1 as unknown as WatchedController<Controller1>;

	@watch
	class Controller2 extends ControllerBase<any> {
		@watch
		async init() {
			callStack.push('2 start');
			await asyncOperation();
			await asyncOperation();
			await asyncOperation();
			// callStack.push('2 end');
		}
	}
	const controller2 = Controller2 as unknown as WatchedController<Controller2>;

	@watch
	class Controller3 extends ControllerBase<any> {
		@watch
		async init() {
			callStack.push('3 start');
			await asyncOperation();
			// callStack.push('3 end');
		}
	}
	const controller3 = Controller3 as unknown as WatchedController<Controller3>;

	const next = ((action: Action) => {}) as Dispatch;

	const middleware = controllerMiddleware();

	const handleAction = middleware({
		dispatch: (action) => {
			handleAction(action);
			return action;
		},
		getState(): any {
			return {};
		},
	})(next);

	const action = controller1.init();
	action.addNextActions(controller2.init());

	await handleAction(action);
	expect(callStack).toEqual([
		'1 start',
		'1 end',
		// controller3 is dispatched immediately after controller1 is end
		'3 start',
		// after that callback action is dispatched
		'2 start',
		// we can't know in this test when 2nd and 3rd promises will be ended
		// '3 end',
		// '2 end',
	]);
});
