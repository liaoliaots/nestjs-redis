import { Cluster } from 'ioredis';
import { ClusterClientOptions, ClusterClients } from '../interfaces';
import { ClientNamespace } from '@/interfaces';
import { READY_LOG, ERROR_LOG } from '@/messages';
import { logger } from '../cluster-logger';
import { parseNamespace } from '@/utils';
import { READY_EVENT, ERROR_EVENT } from '@/constants';

export const createClient = (clientOptions: ClusterClientOptions): Cluster => {
    // eslint-disable-next-line deprecation/deprecation, @typescript-eslint/no-unused-vars
    const { namespace, nodes, onClientCreated, ...clusterOptions } = clientOptions;

    const client = new Cluster(nodes, clusterOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: ClusterClients): void => {
    clients.forEach((client, namespace) => {
        client.on(READY_EVENT, () => {
            logger.log(READY_LOG(parseNamespace(namespace)));
        });
    });
};

export const displayErrorLog = (clients: ClusterClients): void => {
    clients.forEach((client, namespace) => {
        client.on(ERROR_EVENT, (error: Error) => {
            logger.error(ERROR_LOG({ namespace: parseNamespace(namespace), error }), error.stack);
        });
    });
};

export const quitClients = (clients: ClusterClients) => {
    const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === READY_EVENT) {
            promises.push(Promise.allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }
        client.disconnect();
    });

    return Promise.all(promises);
};
