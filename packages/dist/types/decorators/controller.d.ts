import type { Controller, ControllerConstructor } from '../types/index.js';
export interface Class_ReduxControllerDecorator {
    <TController extends Controller, TConstructor extends ControllerConstructor<TController>>(constructor: TConstructor, context: ClassDecoratorContext): TConstructor;
    <TController extends Controller, TConstructor extends ControllerConstructor<TController>>(constructor: TConstructor): TConstructor;
}
export interface ClassFactory_ReduxControllerDecorator {
    /**
     * @param nameSalt {string} is used to add unique salt to action name to avoid collisions, if you have a few controllers with the same name and method names.
     * But if this is your intention, you may pass empty string to disable salt adding to the controller
     * */
    (nameSalt: string): Class_ReduxControllerDecorator;
}
export interface ReduxControllerDecorator extends Class_ReduxControllerDecorator, ClassFactory_ReduxControllerDecorator {
}
/**
 * It registers your controller in the middleware. You need to add `@actionHandler` decorator to some of your methods
 * */
export declare const controller: ReduxControllerDecorator;
