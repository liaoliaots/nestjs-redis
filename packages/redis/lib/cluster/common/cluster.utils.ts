import { Cluster } from 'ioredis';
import { ClusterClientOptions, ClusterModuleOptions } from '../interfaces';
import { Namespace } from '@/interfaces';
import { generateReadyMessage, generateErrorMessage } from '@/messages';
import { logger } from '../cluster-logger';
import { get } from '@/utils';
import { DEFAULT_CLUSTER, NAMESPACE_KEY } from '../cluster.constants';

export const createClient = (
  { namespace, nodes, onClientCreated, ...clusterOptions }: ClusterClientOptions,
  { readyLog, errorLog }: Partial<ClusterModuleOptions>
): Cluster => {
  const client = new Cluster(nodes, clusterOptions);
  Reflect.defineProperty(client, NAMESPACE_KEY, {
    value: namespace ?? DEFAULT_CLUSTER,
    writable: false,
    enumerable: false,
    configurable: false
  });
  if (readyLog) {
    client.on('ready', () => {
      logger.log(generateReadyMessage(get<Namespace>(client, NAMESPACE_KEY)));
    });
  }
  if (errorLog) {
    client.on('error', (error: Error) => {
      logger.error(generateErrorMessage(get<Namespace>(client, NAMESPACE_KEY), error.message), error.stack);
    });
  }
  if (onClientCreated) onClientCreated(client);
  return client;
};
