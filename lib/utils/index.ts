import { PromiseResult, PromiseResolution, PromiseRejection } from 'promise.allsettled';
import { ClientNamespace, Constructor } from '@/interfaces';

/**
 * Parses namespace to string.
 *
 * @param namespace - The namespace of the client
 */
export const parseNamespace = (namespace: ClientNamespace): string => {
    if (isString(namespace)) return namespace;
    return namespace.toString();
};

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
 * Returns `true` if the value is of type `PromiseResolution`.
 *
 * @param value - The promise result
 */
export const isResolution = <T>(value: PromiseResult<T>): value is PromiseResolution<T> => {
    return value.status === 'fulfilled';
};

/**
 * Returns `true` if the value is of type `PromiseRejection`.
 *
 * @param value - The promise result
 */
export const isRejection = <T>(value: PromiseResult<T>): value is PromiseRejection<T> => {
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
