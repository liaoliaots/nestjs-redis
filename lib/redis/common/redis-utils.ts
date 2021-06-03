import IORedis, { Redis } from 'ioredis';
import { ClientOptions } from '../interfaces';

export const createClient = (options: ClientOptions): Redis => {
    const { url, ...redisOptions } = options;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(options);

    return client;
};

/**
 * Parses namespace of the client to string.
 *
 * @param namespace - The namespace of the client
 * @returns A readable string
 */
export const parseNamespace = (namespace: unknown): string => {
    if (typeof namespace === 'string') return namespace;
    if (typeof namespace === 'symbol') return namespace.toString();

    return 'unknown';
};
