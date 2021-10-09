import { Logger } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { RedisClientOptions, RedisClients } from '../interfaces';
import { REDIS_MODULE_ID, RedisStatus } from '../redis.constants';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';
import { CONNECTED_SUCCESSFULLY } from '@/messages';

export const logger = new Logger(REDIS_MODULE_ID);

export const createClient = (clientOptions: RedisClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.once(RedisStatus.READY, () => {
            logger.log(`${parseNamespace(namespace)}: ${CONNECTED_SUCCESSFULLY}`);
        });
    });
};

export const quitClients = (
    clients: RedisClients
): Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>][]> => {
    const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === RedisStatus.READY) {
            promises.push(Promise.allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }

        client.disconnect();
    });

    return Promise.all(promises);
};

export const readPromiseSettledResults = (
    results: [PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>][]
): void => {
    results.forEach(([namespaceResult, quitResult]) => {
        if (
            namespaceResult.status === 'fulfilled' &&
            quitResult.status === 'rejected' &&
            quitResult.reason instanceof Error
        ) {
            logger.error(`${parseNamespace(namespaceResult.value)}: ${quitResult.reason.message}`);
        }
    });
};
