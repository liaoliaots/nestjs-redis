import { Inject } from '@nestjs/common';
import { ClientNamespace } from '../../interfaces';
import { DEFAULT_REDIS_CLIENT } from '../redis.constants';

export const namespaces: ClientNamespace[] = [];

export const InjectRedisClient = (namespace: ClientNamespace = DEFAULT_REDIS_CLIENT): ReturnType<typeof Inject> => {
    namespaces.push(namespace);

    return Inject(namespace);
};
