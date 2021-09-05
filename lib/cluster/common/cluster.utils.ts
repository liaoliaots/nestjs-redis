import { Logger } from '@nestjs/common';
import IORedis, { Cluster } from 'ioredis';
import { ClientOptions, ClusterClients } from '../interfaces';
import { LOGGER_CONTEXT } from '../cluster.constants';

export const createClient = (clientOptions: ClientOptions): Cluster => {
    const { nodes, options, onClientCreated } = clientOptions;

    const client = new IORedis.Cluster(nodes, options);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: ClusterClients): void => {
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
