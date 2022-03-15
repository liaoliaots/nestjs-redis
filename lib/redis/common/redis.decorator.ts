import { Inject } from '@nestjs/common';
import { DEFAULT_REDIS_NAMESPACE, REDIS_MODULE_ID } from '../redis.constants';
import { ClientNamespace } from '@/interfaces';
import { isString, isSymbol } from '@/utils';

export const namespaces = new Map<ClientNamespace, ClientNamespace>();

/**
 * This decorator is used to mark a specific class property as a redis client.
 *
 * @param namespace - Client name
 */
export const InjectRedis = (namespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE): ReturnType<typeof Inject> => {
    if (isString(namespace)) {
        const token = getRedisToken(namespace);
        namespaces.set(namespace, token);
        return Inject(token);
    }

    namespaces.set(namespace, namespace);
    return Inject(namespace);
};

/**
 * This function generates an injection token for a redis client.
 *
 * @param namespace - Client name
 */
export const getRedisToken = (namespace: ClientNamespace): ClientNamespace => {
    if (isSymbol(namespace)) return namespace;
    return `${REDIS_MODULE_ID}:${namespace}`;
};
