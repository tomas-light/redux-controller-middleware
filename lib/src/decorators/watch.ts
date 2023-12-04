import { Constructor, Controller, ControllerConstructor } from '../types';
import { reducer } from './reducer';
import { reduxController } from './reduxController';

export function watch<TController extends Controller, TConstructor extends ControllerConstructor<TController>>(
  constructor: TConstructor,
  context: ClassDecoratorContext
): TConstructor;

export function watch<This, Args extends any[], Return>(
  method: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
): typeof method;

/**
 * It is just shortcut for two decorators: `@reduxController` + `@actionHandler`,
 * we recommend to use them directly instead of `watch`, because your code will be easier to understand for newcomers then.
 * Name "watch" kept for backward compatibility
 * */
export function watch(constructorOrMethod?: any, context?: DecoratorContext) {
  if (context?.kind === 'class') {
    return reduxController(constructorOrMethod as Constructor, context);
  }

  if (context?.kind === 'method') {
    return reducer(constructorOrMethod, context);
  }

  if (context?.kind === 'field') {
    return reducer(constructorOrMethod, context as unknown as ClassMethodDecoratorContext);
  }

  console.error(
    `Decorator watch can be used only with classes and class's methods. And you are trying to use it with "${context?.kind}"`
  );
  return constructorOrMethod;
}
