import IORedis, { Cluster } from 'ioredis';
import { ClientOptions, ClusterClients } from '../interfaces';

export const createClient = (options: ClientOptions): Cluster => {
    const { startupNodes, clusterOptions, onClientCreated } = options;

    const client = new IORedis.Cluster(startupNodes, clusterOptions);

    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: ClusterClients): void => {
    clients.forEach(client => {
        if (client.status !== 'end') void client.quit();
    });
};
