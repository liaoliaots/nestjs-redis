import { Inject } from '@nestjs/common';
import { DEFAULT_REDIS_NAMESPACE, REDIS_MODULE_ID } from '../redis.constants';
import { ClientNamespace } from '@/interfaces';
import { isSymbol } from '@/utils';

export const namespaces = new Map<ClientNamespace, ClientNamespace>();

/**
 * This decorator is used to mark a specific constructor parameter as a redis client.
 *
 * @param namespace - Client name
 *
 * @public
 */
export const InjectRedis = (namespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE): ParameterDecorator => {
  const token = getRedisToken(namespace);
  namespaces.set(namespace, token);
  return Inject(token);
};

/**
 * This function generates an injection token for a redis client.
 *
 * @param namespace - Client name
 *
 * @public
 */
export const getRedisToken = (namespace: ClientNamespace): ClientNamespace => {
  if (isSymbol(namespace)) return namespace;
  return `${REDIS_MODULE_ID}:${namespace}`;
};
