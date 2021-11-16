import { Logger } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import allSettled, { PromiseResult } from 'promise.allsettled';
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

export const quitClients = async (
    clients: RedisClients
): Promise<[PromiseResult<ClientNamespace>, PromiseResult<'OK'>][]> => {
    const promises: Promise<[PromiseResult<ClientNamespace>, PromiseResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === RedisStatus.READY) {
            promises.push(allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }
        client.disconnect();
    });

    return await Promise.all(promises);
};
