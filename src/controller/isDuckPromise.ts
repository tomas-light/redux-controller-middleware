function isNullOrUndefined(maybePromise: any): maybePromise is null | undefined {
	return maybePromise === null || typeof maybePromise === 'undefined';
}

function isDuckPromise(maybePromise: any): maybePromise is Promise<any> {
	if (isNullOrUndefined(maybePromise)) {
		return false;
	}

	if (
		typeof maybePromise === 'object' &&
		typeof maybePromise.then === 'function' &&
		typeof maybePromise.catch === 'function'
	) {
		return true;
	}

	return false;
}

export { isDuckPromise };
