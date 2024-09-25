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
