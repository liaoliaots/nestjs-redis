import { Cluster } from 'ioredis';
import { ClusterClientOptions, ClusterClients } from '../interfaces';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';
import { CONNECTED_SUCCESSFULLY } from '@/messages';
import { logger } from '../cluster-logger';

export const createClient = (clientOptions: ClusterClientOptions): Cluster => {
    const { nodes, onClientCreated, ...clusterOptions } = clientOptions;

    const client = new Cluster(nodes, clusterOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: ClusterClients): void => {
    clients.forEach((client, namespace) => {
        client.on('ready', () => {
            logger.log(`${parseNamespace(namespace)}: ${CONNECTED_SUCCESSFULLY}`);
        });
    });
};

export const displayErrorLog = (clients: ClusterClients): void => {
    clients.forEach((client, namespace) => {
        client.on('error', (error: Error) => {
            logger.error(`${parseNamespace(namespace)}: ${error.message}`, error.stack);
        });
    });
};

export const quitClients = (
    clients: ClusterClients
): Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>][]> => {
    const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === 'ready') {
            promises.push(Promise.allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }
        client.disconnect();
    });

    return Promise.all(promises);
};
