import Redis from 'ioredis';
import { RedisClientOptions, RedisClients } from '../interfaces';
import { ClientNamespace } from '@/interfaces';
import { READY_LOG, ERROR_LOG } from '@/messages';
import { logger } from '../redis-logger';
import { parseNamespace } from '@/utils';
import { READY_EVENT, ERROR_EVENT } from '@/constants';

export const createClient = (clientOptions: RedisClientOptions): Redis => {
    // eslint-disable-next-line deprecation/deprecation, @typescript-eslint/no-unused-vars
    const { namespace, url, path, onClientCreated, ...redisOptions } = clientOptions;

    let client: Redis;
    if (url) client = new Redis(url, redisOptions);
    else if (path) client = new Redis(path, redisOptions);
    else client = new Redis(redisOptions);

    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.on(READY_EVENT, () => {
            logger.log(READY_LOG(parseNamespace(namespace)));
        });
    });
};

export const displayErrorLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.on(ERROR_EVENT, (error: Error) => {
            logger.error(ERROR_LOG({ namespace: parseNamespace(namespace), error }), error.stack);
        });
    });
};

export const quitClients = (clients: RedisClients) => {
    const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === READY_EVENT) {
            promises.push(Promise.allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }
        client.disconnect();
    });

    return Promise.all(promises);
};
