import { inheritancePreserveSymbol } from '../symbols';
import { Constructor, WatchedConstructor } from '../types';

class InheritancePreserver {
	static constructorModified(constructor: Constructor) {
		(constructor as WatchedConstructor<any>)[inheritancePreserveSymbol] = constructor;
	}

	static getModifiedConstructor<T = any>(constructor: Constructor): T {
		return (constructor as WatchedConstructor<any>)[inheritancePreserveSymbol] as T;
	}
}

export { InheritancePreserver };
