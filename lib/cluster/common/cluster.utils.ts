import { Logger } from '@nestjs/common';
import IORedis, { Cluster } from 'ioredis';
import { ClientOptions, ClusterClients } from '../interfaces';

export const createClient = (clientOptions: ClientOptions): Cluster => {
    const { nodes, options, onClientCreated } = clientOptions;

    const client = new IORedis.Cluster(nodes, options);

    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: ClusterClients): void => {
    const logger = new Logger('ClusterModule');

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
