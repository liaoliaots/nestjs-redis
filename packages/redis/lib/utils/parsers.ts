import { isString } from './is';
import { ClientNamespace } from '@/interfaces';

/**
 * Parses namespace to string.
 *
 * @param namespace - The namespace of the client
 */
export const parseNamespace = (namespace: ClientNamespace): string =>
  isString(namespace) ? namespace : namespace.toString();
