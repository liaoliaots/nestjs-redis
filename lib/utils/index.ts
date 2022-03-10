import { ClientNamespace } from '@/interfaces';
import { isString, isSymbol, isError, isResolution, isRejection, isDirectInstanceOf } from './is';

export * from './promise-timeout';
export { isString, isSymbol, isError, isResolution, isRejection, isDirectInstanceOf };

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
 * Replaces the line breaks with a space.
 *
 * @param text - Some text
 */
export const removeLineBreaks = (text: string): string => {
    return text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ');
};

/**
 * Parses used_memory to number.
 */
export const parseUsedMemory = (info: string): number => {
    const start = info.indexOf('used_memory');
    const end = info.indexOf('used_memory_human') - 1;
    return Number.parseInt(info.slice(start, end).split(':')[1], 10);
};

/**
 * Checks if the value is not defined (=== null, === undefined).
 */
export const isNullish = (value: unknown): value is undefined | null => value === undefined || value === null;
