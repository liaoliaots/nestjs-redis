import { Constructor } from '@/interfaces';

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
 * Returns `true` if the value is an `Error`.
 *
 * @param value - Any value
 */
export const isError = (value: unknown): value is Error => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { toString } = Object.prototype;
    const typeName = toString.call(value).slice(8, -1);
    return typeName === 'Error';
};

/**
 * Returns `true` if the value is of type `PromiseFulfilledResult`.
 *
 * @param value - The promise result
 */
export const isResolution = <T>(value: PromiseSettledResult<T>): value is PromiseFulfilledResult<T> => {
    return value.status === 'fulfilled';
};

/**
 * Returns `true` if the value is of type `PromiseRejectedResult`.
 *
 * @param value - The promise result
 */
export const isRejection = (value: PromiseSettledResult<unknown>): value is PromiseRejectedResult => {
    return value.status === 'rejected';
};

/**
 * Returns `true` if the value is a direct instance of `class`.
 *
 * @param value - Any value
 * @param class_ - Any class
 */
export const isDirectInstanceOf = <T>(value: unknown, class_: Constructor<T>): value is T => {
    return Object.getPrototypeOf(value) === class_.prototype;
};

/**
 * Checks if the value is not defined (=== null, === undefined).
 */
export const isNullish = (value: unknown): value is undefined | null => value === undefined || value === null;
