import { tryToFindDependencyContainer } from './tryToFindDependencyContainer';

test('if there is no container it returns undefined', () => {
	const container = tryToFindDependencyContainer({} as any);
	expect(container).toBeUndefined();
});

test('if there is container getter it returns result of that getter', () => {
	const mockContainer = {} as any;
	const getContainer = jest.fn(() => mockContainer);

	const container = tryToFindDependencyContainer({} as any, getContainer);
	expect(getContainer).toBeCalledTimes(1);
	expect(container).toBe(mockContainer);
});

test('if action container should override container getter result', () => {
	const mockContainer1 = {} as any;
	const mockContainer2 = {} as any;
	const getContainer = jest.fn(() => mockContainer2);

	const container = tryToFindDependencyContainer({ container: mockContainer1 } as any, getContainer);
	expect(getContainer).toBeCalledTimes(1);
	expect(container).toBe(mockContainer1);
});
