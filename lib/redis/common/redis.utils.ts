import { Logger } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { ClientOptions, RedisClients } from '../interfaces';

export const createClient = (clientOptions: ClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);

    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: RedisClients): void => {
    const logger = new Logger('RedisModule');

    clients.forEach(client => {
        if (client.status === 'ready') {
            client.quit().catch(error => {
                if (error instanceof Error) logger.error(error.message);
            });

            return;
        }

        client.disconnect();
    });
};
