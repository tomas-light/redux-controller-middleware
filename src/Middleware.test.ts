import { Middleware } from './Middleware';

test('There is an error if you instantiate Middleware class', () => {
	expect(() => new Middleware()).toThrowError();
});
