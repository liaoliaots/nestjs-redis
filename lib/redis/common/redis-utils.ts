import IORedis, { Redis } from 'ioredis';
import { ClientOptions } from '../interfaces';

export const createClient = (options: ClientOptions): Redis => {
    const { url, ...redisOptions } = options;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);

    if (options.onClientCreated) options.onClientCreated(client);

    return client;
};

/**
 * Parses namespace to string.
 *
 * @param namespace - The namespace of a client
 */
export const parseNamespace = (namespace: unknown): string => {
    if (typeof namespace === 'string') return namespace;
    if (typeof namespace === 'symbol') return namespace.toString();

    return 'unknown';
};
