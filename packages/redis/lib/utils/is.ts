/**
 * Returns `true` if the value is of type `string`.
 *
 * @param value - Any value
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Returns `true` if the value is of type `symbol`.
 *
 * @param value - Any value
 */
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol';

/**
 * Returns `true` if the value is an instance of `Error`.
 *
 * @param value - Any value
 */
export const isError = (value: unknown): value is Error => {
  const typeName = Object.prototype.toString.call(value).slice(8, -1);
  return typeName === 'Error';
};

/**
 * Returns `true` if the value is of type `PromiseFulfilledResult`.
 *
 * @param value - `PromiseSettledResult`
 */
export const isResolution = <T>(value: PromiseSettledResult<T>): value is PromiseFulfilledResult<T> => {
  return value.status === 'fulfilled';
};

/**
 * Returns `true` if the value is of type `PromiseRejectedResult`.
 *
 * @param value - `PromiseSettledResult`
 */
export const isRejection = (value: PromiseSettledResult<unknown>): value is PromiseRejectedResult => {
  return value.status === 'rejected';
};
