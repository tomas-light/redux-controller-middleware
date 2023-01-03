import { Container, IHaveDependencies } from '../../cheap-di';
import { Action, ActionMaybeWithContainer, ActionFactory } from './types';

export class AppAction<TPayload = any> implements ActionMaybeWithContainer<TPayload> {
	type: any;
	payload: TPayload;

	readonly actions: (Action | ActionFactory)[];

	stopPropagation: boolean;

	container?: Container & IHaveDependencies;

	constructor(type: string, payload?: TPayload) {
		this.type = type;
		this.payload = payload as TPayload;
		this.actions = [];
		this.stopPropagation = false;
	}

	static addNextActions(appAction: Action, ...actions: (Action | ActionFactory)[]) {
		appAction.actions.push(...actions);
	}

	static stop(appAction: Action): void {
		(appAction as AppAction).stopPropagation = true;
	}

	static getActions(appAction: Action): ActionFactory[] {
		if (!Array.isArray(appAction.actions)) {
			return [];
		}

		return appAction.actions.map((actionOrFactory) => {
			if (typeof actionOrFactory === 'function') {
				return actionOrFactory;
			}
			return () => actionOrFactory;
		});
	}

	addNextActions(...actions: (Action | ActionFactory)[]) {
		AppAction.addNextActions(this, ...actions);
	}

	stop(): void {
		AppAction.stop(this);
	}

	getActions(): ActionFactory[] {
		return AppAction.getActions(this);
	}

	toPlainObject(): Action {
		const keys = Object.keys(this) as (keyof AppAction)[];
		const plainObject = {} as Action;

		keys.forEach((key) => {
			// skip property
			if (key === 'toPlainObject') {
				return;
			}
			if (key === 'actions') {
				plainObject[key as any] = this[key];
				return;
			}
			if (key === 'stopPropagation') {
				plainObject[key as any] = this[key];
				return;
			}
			plainObject[key] = this[key];
		});

		plainObject.addNextActions = function (...actions: Action[]) {
			AppAction.addNextActions(this, ...actions);
		};
		plainObject.stop = function () {
			AppAction.stop(this);
		};
		plainObject.getActions = function () {
			return AppAction.getActions(this);
		};

		return plainObject;
	}
}
