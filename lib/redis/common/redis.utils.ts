import { Logger } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { RedisClientOptions, RedisClients } from '../interfaces';
import { REDIS_MODULE_ID, RedisStatus } from '../redis.constants';
import { parseNamespace } from '@/utils';

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
            logger.log(`${parseNamespace(namespace)}: Connected successfully to the server`);
        });
    });
};

export const quitClients = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        if (client.status === RedisStatus.READY) {
            client.quit().catch(reason => {
                if (reason instanceof Error) logger.error(`${parseNamespace(namespace)}: ${reason.message}`);
            });
            return;
        }

        client.disconnect();
    });
};
