import { isString } from './is';
import { Namespace } from '@/interfaces';

/**
 * Parses namespace to string.
 *
 * @param namespace - The namespace
 * @returns A string value
 */
export const parseNamespace = (namespace: Namespace): string =>
  isString(namespace) ? namespace : namespace.toString();
