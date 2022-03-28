import Redis from 'ioredis';
import { RedisClientOptions, RedisClients } from '../interfaces';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';
import { CONNECTED_SUCCESSFULLY } from '@/messages';
import { logger } from '../redis-logger';

export const createClient = (clientOptions: RedisClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new Redis(url, redisOptions) : new Redis(redisOptions);
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
): Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>][]> => {
    const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === 'ready') {
            promises.push(Promise.allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }
        client.disconnect();
    });

    return Promise.all(promises);
};
