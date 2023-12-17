import { Middleware } from './Middleware.js';

test('There is an error if you instantiate Middleware class', () => {
  expect(() => new Middleware()).toThrowError();
});
