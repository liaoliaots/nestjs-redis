import { Cluster } from 'ioredis';
import { ClusterClientOptions, ClusterClients, ClusterModuleOptions } from '../interfaces';
import { ClientNamespace } from '@/interfaces';
import { READY_LOG, ERROR_LOG } from '@/messages';
import { logger } from '../cluster-logger';
import { parseNamespace } from '@/utils';
import { READY_EVENT, ERROR_EVENT, END_EVENT } from '@/constants';
import { DEFAULT_CLUSTER_NAMESPACE, NAMESPACE_KEY } from '../cluster.constants';

export const addListeners = ({
  namespace,
  instance,
  readyLog,
  errorLog
}: {
  namespace: ClientNamespace;
  instance: Cluster;
  readyLog?: boolean;
  errorLog?: boolean;
}) => {
  Reflect.set(instance, NAMESPACE_KEY, namespace);
  if (readyLog) {
    instance.on(READY_EVENT, function (this: Cluster) {
      logger.log(READY_LOG(parseNamespace(Reflect.get(this, NAMESPACE_KEY) as ClientNamespace)));
    });
  }
  if (errorLog) {
    instance.on(ERROR_EVENT, function (this: Cluster, error: Error) {
      logger.error(
        ERROR_LOG(parseNamespace(Reflect.get(this, NAMESPACE_KEY) as ClientNamespace), error.message),
        error.stack
      );
    });
  }
};

export const createClient = (
  { namespace, nodes, onClientCreated, ...clusterOptions }: ClusterClientOptions,
  { readyLog, errorLog }: Partial<ClusterModuleOptions>
): Cluster => {
  const client = new Cluster(nodes, clusterOptions);
  addListeners({ namespace: namespace ?? DEFAULT_CLUSTER_NAMESPACE, instance: client, readyLog, errorLog });
  if (onClientCreated) onClientCreated(client);
  return client;
};

export const destroy = async (clients: ClusterClients) => {
  const promises: Promise<[PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]>[] = [];
  clients.forEach((client, namespace) => {
    if (client.status === END_EVENT) return;
    if (client.status === READY_EVENT) {
      promises.push(Promise.allSettled([namespace, client.quit()]));
      return;
    }
    client.disconnect();
  });
  return await Promise.all(promises);
};
