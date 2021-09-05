import { Inject } from '@nestjs/common';
import { DEFAULT_REDIS_NAMESPACE, DECORATOR_DI_TOKEN_PREFIX } from '../redis.constants';
import { ClientNamespace } from '@/interfaces';
import { isString, isSymbol } from '@/utils';

export const namespaces = new Map<ClientNamespace, ClientNamespace>();

export const InjectRedis = (namespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE): ReturnType<typeof Inject> => {
    if (isString(namespace)) {
        const token = getRedisToken(namespace);
        namespaces.set(namespace, token);
        return Inject(token);
    }

    namespaces.set(namespace, namespace);
    return Inject(namespace);
};

export const getRedisToken = (namespace: ClientNamespace): ClientNamespace => {
    if (isSymbol(namespace)) return namespace;
    return `${DECORATOR_DI_TOKEN_PREFIX}:${namespace}`;
};
