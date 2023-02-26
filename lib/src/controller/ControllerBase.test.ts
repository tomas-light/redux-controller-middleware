import { ControllerBase } from './ControllerBase';

test('if exception will be thrown for direct ControllerBase instantiating', () => {
	expect(() => new ControllerBase({} as any)).toThrowError();
});
