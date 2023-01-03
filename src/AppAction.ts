import { Container, IHaveDependencies } from '../../cheap-di';
import { Action, ActionMaybeWithContainer, ActionFactory } from './types';

export class AppAction<Payload = undefined> implements ActionMaybeWithContainer<Payload> {
	type: any;
	payload: Payload;

	readonly actions: (Action | ActionFactory)[];

	stopPropagation: boolean;

	container?: Container & IHaveDependencies;

	constructor(type: string, payload?: Payload) {
		this.type = type;
		this.payload = payload as Payload;
		this.actions = [];
		this.stopPropagation = false;
	}

	static addNextActions<Payload>(appAction: Action<Payload>, ...actions: (Action | ActionFactory)[]) {
		appAction.actions.push(...actions);
	}

	static stop<Payload>(appAction: Action<Payload>): void {
		(appAction as AppAction<Payload>).stopPropagation = true;
	}

	static getActions<Payload>(appAction: Action<Payload>): ActionFactory[] {
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

	toPlainObject(): Action<Payload> {
		const keys = Object.keys(this) as (keyof AppAction<Payload>)[];
		const plainObject = {} as Action<Payload>;

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
