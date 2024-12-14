import { Class } from '@/interfaces';

/**
 * Returns `true` if the value is of type `string`.
 *
 * @param value - Any value
 * @returns A boolean value for Type Guard
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Returns `true` if the value is an instance of `Error`.
 *
 * @param value - Any value
 * @returns A boolean value for Type Guard
 */
export const isError = (value: unknown): value is Error => {
  const typeName = Object.prototype.toString.call(value).slice(8, -1);
  return typeName === 'Error';
};

/**
 * Returns `true` if value is a direct instance of class.
 *
 * @param instance - Any value
 * @param class_ - A class or function that can be instantiated
 * @returns A boolean value for Type Guard
 */
export const isDirectInstanceOf = <T>(instance: unknown, class_: Class<T>): instance is T => {
  if (instance === undefined || instance === null) return false;
  return Object.getPrototypeOf(instance) === class_.prototype;
};
