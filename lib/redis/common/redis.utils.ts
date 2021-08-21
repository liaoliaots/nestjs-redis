import IORedis, { Redis } from 'ioredis';
import { ClientOptions, RedisClients } from '../interfaces';

export const createClient = (clientOptions: ClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = clientOptions;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: RedisClients): Promise<PromiseSettledResult<'OK'>[]> => {
    const promises: Promise<'OK'>[] = [];

    clients.forEach(client => {
        if (client.status === 'ready') {
            promises.push(client.quit());
            return;
        }

        client.disconnect();
    });

    return Promise.allSettled(promises);
};
