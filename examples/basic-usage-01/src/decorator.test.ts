import { Constructor } from 'cheap-di';

test('', () => {
  @classDecorator
  class Temp {
    constructor() {}

    @methodDecorator
    myMethod() {
      return 'qwe';
    }

    @methodDecorator
    myUmethod() {
      return 'zzz';
    }
  }

  // const temp = new Temp();
  (Temp as any).myMethod();

  expect(true).toBeTruthy();
});

const mySymbol = Symbol();
type MyMetadata = Record<string, boolean | undefined>;

function classDecorator<TConstructor extends Constructor>(
  constructor: TConstructor,
  context: ClassDecoratorContext
): TConstructor {
  context.addInitializer(function () {
    try {
      new constructor(); // to trigger all method initializers
    } catch {}
  });

  return constructor;
}

function methodDecorator<This, Args extends any[], Return>(
  method: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
): typeof method {
  if (typeof context.name === 'symbol') {
    throw new Error('Cannot decorate symbol names.');
  }

  context.addInitializer(function () {
    (this as any).constructor[context.name as string] = (() => {
      console.log(context.name);
    }) as any;
  });

  return method;
}
