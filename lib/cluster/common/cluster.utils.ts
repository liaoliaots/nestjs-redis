import { Logger } from '@nestjs/common';
import IORedis, { Cluster } from 'ioredis';
import { ClusterClientOptions, ClusterClients } from '../interfaces';
import { CLUSTER_MODULE_ID, ClusterStatus } from '../cluster.constants';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';

export const logger = new Logger(CLUSTER_MODULE_ID);

export const createClient = (clientOptions: ClusterClientOptions): Cluster => {
    const { nodes, options, onClientCreated } = clientOptions;

    const client = new IORedis.Cluster(nodes, options);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: ClusterClients): void => {
    clients.forEach((client, namespace) => {
        client.once(ClusterStatus.READY, () => {
            logger.log(`${parseNamespace(namespace)}: Connected successfully to the server`);
        });
    });
};

export const quitClients = (
    clients: ClusterClients
): Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>][]> => {
    const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === ClusterStatus.READY) {
            promises.push(Promise.allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }

        client.disconnect();
    });

    return Promise.all(promises);
};

export const readPromiseSettledResults = (
    results: [PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>][]
): void => {
    results.forEach(([namespaceResult, quitResult]) => {
        if (
            namespaceResult.status === 'fulfilled' &&
            quitResult.status === 'rejected' &&
            quitResult.reason instanceof Error
        ) {
            logger.error(`${parseNamespace(namespaceResult.value)}: ${quitResult.reason.message}`);
        }
    });
};
