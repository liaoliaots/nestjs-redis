import IORedis, { Redis } from 'ioredis';
import allSettled, { PromiseResult } from 'promise.allsettled';
import { RedisClientOptions, RedisClients } from '../interfaces';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';
import { CONNECTED_SUCCESSFULLY } from '@/messages';
import { logger } from '../redis-logger';

export const createClient = (clientOptions: RedisClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.on('ready', () => {
            logger.log(`${parseNamespace(namespace)}: ${CONNECTED_SUCCESSFULLY}`);
        });
    });
};

export const displayErrorLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.on('error', (error: Error) => {
            logger.error(`${parseNamespace(namespace)}: ${error.message}`, error.stack);
        });
    });
};

export const quitClients = (
    clients: RedisClients
): Promise<[PromiseResult<ClientNamespace>, PromiseResult<'OK'>][]> => {
    const promises: Promise<[PromiseResult<ClientNamespace>, PromiseResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === 'ready') {
            promises.push(allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }
        client.disconnect();
    });

    return Promise.all(promises);
};
