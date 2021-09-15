import { Logger } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { RedisClientOptions, RedisClients } from '../interfaces';
import { LOGGER_CONTEXT } from '../redis.constants';
import { parseNamespace } from '@/utils';

export const logger = new Logger(LOGGER_CONTEXT);

export const createClient = (clientOptions: RedisClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        client.once('ready', () => {
            logger.log(`${parseNamespace(namespace)}: Connected successfully to the server`);
        });
    });
};

export const quitClients = (clients: RedisClients): void => {
    clients.forEach((client, namespace) => {
        if (client.status === 'ready') {
            client.quit().catch(reason => {
                if (reason instanceof Error) logger.error(`${parseNamespace(namespace)}: ${reason.message}`);
            });
            return;
        }

        client.disconnect();
    });
};
