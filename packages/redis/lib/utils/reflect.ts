/**
 * This is equivalent to `Reflect.get()`.
 *
 * @param target - The target object
 * @param key - The property name
 * @returns Unknown value
 */
export const get = <T>(target: object, key: PropertyKey) => Reflect.get(target, key) as T;
