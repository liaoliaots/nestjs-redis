import { Logger } from '@nestjs/common';
import IORedis, { Cluster } from 'ioredis';
import { ClusterClientOptions, ClusterClients } from '../interfaces';
import { LOGGER_CONTEXT } from '../cluster.constants';
import { parseNamespace } from '@/utils';

export const logger = new Logger(LOGGER_CONTEXT);

export const createClient = (clientOptions: ClusterClientOptions): Cluster => {
    const { nodes, options, onClientCreated } = clientOptions;

    const client = new IORedis.Cluster(nodes, options);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: ClusterClients): void => {
    clients.forEach((client, namespace) => {
        client.once('ready', () => {
            logger.log(`${parseNamespace(namespace)}: Connected successfully to the server`);
        });
    });
};

export const quitClients = (clients: ClusterClients): void => {
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
