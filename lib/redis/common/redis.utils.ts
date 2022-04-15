import Redis from 'ioredis';
import { RedisClientOptions, RedisClients } from '../interfaces';
import { ClientNamespace } from '@/interfaces';
import { READY_LOG, ERROR_LOG } from '@/messages';
import { logger } from '../redis-logger';
import { parseNamespace } from '@/utils';

export const createClient = (clientOptions: RedisClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new Redis(url, redisOptions) : new Redis(redisOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.on('ready', () => {
            logger.log(READY_LOG(parseNamespace(namespace)));
        });
    });
};

export const displayErrorLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.on('error', (error: Error) => {
            logger.error(ERROR_LOG({ namespace: parseNamespace(namespace), error }), error.stack);
        });
    });
};

export const quitClients = (clients: RedisClients) => {
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
