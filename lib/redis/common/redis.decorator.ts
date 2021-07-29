import { Inject } from '@nestjs/common';
import { ClientNamespace } from '@/interfaces';
import { DEFAULT_REDIS_NAMESPACE } from '../redis.constants';

export const namespaces: ClientNamespace[] = [];

export const InjectRedis = (namespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE): ReturnType<typeof Inject> => {
    namespaces.push(namespace);

    return Inject(namespace);
};
