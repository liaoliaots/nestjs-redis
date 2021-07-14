import IORedis, { Cluster } from 'ioredis';
import { ClientOptions, ClusterClients } from '../interfaces';

export const createClient = (clientOptions: ClientOptions): Cluster => {
    const { nodes, options, onClientCreated } = clientOptions;

    const client = new IORedis.Cluster(nodes, options);

    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: ClusterClients): void => {
    clients.forEach(client => {
        if (client.status === 'ready') {
            client.quit().catch(() => ({}));

            return;
        }

        client.disconnect();
    });
};
