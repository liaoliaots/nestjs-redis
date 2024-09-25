/**
 * Same as Reflect.get
 *
 * @param target
 * @param propertyKey
 */
export const get = <T>(target: object, propertyKey: PropertyKey) => Reflect.get(target, propertyKey) as T;
