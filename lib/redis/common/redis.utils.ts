import { Logger } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { ClientOptions, RedisClients } from '../interfaces';
import { LOGGER_CONTEXT } from '../redis.constants';

export const createClient = (clientOptions: ClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: RedisClients): void => {
    const logger = new Logger(LOGGER_CONTEXT);

    clients.forEach(client => {
        if (client.status === 'ready') {
            client.quit().catch(reason => {
                if (reason instanceof Error) logger.error(reason.message);
            });
            return;
        }

        client.disconnect();
    });
};
