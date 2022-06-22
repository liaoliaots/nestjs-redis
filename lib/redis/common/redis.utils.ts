import Redis from 'ioredis';
import { RedisClientOptions, RedisClients, RedisModuleOptions } from '../interfaces';
import { ClientNamespace } from '@/interfaces';
import { READY_LOG, ERROR_LOG } from '@/messages';
import { logger } from '../redis-logger';
import { parseNamespace } from '@/utils';
import { READY_EVENT, ERROR_EVENT, END_EVENT } from '@/constants';
import { DEFAULT_REDIS_NAMESPACE, NAMESPACE_KEY } from '../redis.constants';

export const addListeners = ({
    namespace,
    instance,
    readyLog,
    errorLog
}: {
    namespace: ClientNamespace;
    instance: Redis;
    readyLog?: boolean;
    errorLog?: boolean;
}) => {
    Reflect.set(instance, NAMESPACE_KEY, namespace);
    if (readyLog) {
        instance.on(READY_EVENT, function (this: Redis) {
            const namespace = Reflect.get(this, NAMESPACE_KEY) as ClientNamespace;
            logger.log(READY_LOG(parseNamespace(namespace)));
        });
    }
    if (errorLog) {
        instance.on(ERROR_EVENT, function (this: Redis, error: Error) {
            const namespace = Reflect.get(this, NAMESPACE_KEY) as ClientNamespace;
            logger.error(ERROR_LOG(parseNamespace(namespace), error), error.stack);
        });
    }
};

export const createClient = (
    { namespace, url, path, onClientCreated, ...redisOptions }: RedisClientOptions,
    { readyLog, errorLog }: RedisModuleOptions
): Redis => {
    const finalNamespace = namespace ?? DEFAULT_REDIS_NAMESPACE;
    let client: Redis;
    if (url) client = new Redis(url, redisOptions);
    else if (path) client = new Redis(path, redisOptions);
    else client = new Redis(redisOptions);
    addListeners({ namespace: finalNamespace, instance: client, readyLog, errorLog });
    if (onClientCreated) onClientCreated(client);
    return client;
};

export const destroy = async (clients: RedisClients) => {
    const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === END_EVENT) return;
        if (client.status === READY_EVENT) {
            promises.push(Promise.allSettled([namespace, client.quit()]));
            return;
        }
        client.disconnect();
    });

    return await Promise.all(promises);
};
