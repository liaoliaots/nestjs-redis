import { ClientNamespace } from '@/interfaces';

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
 * Returns true if the value is of type string.
 *
 * @param value - Any value
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Returns true if the value is of type symbol.
 *
 * @param value - Any value
 */
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol';
