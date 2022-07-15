import { Inject } from '@nestjs/common';
import { DEFAULT_CLUSTER_NAMESPACE, CLUSTER_MODULE_ID } from '../cluster.constants';
import { ClientNamespace } from '@/interfaces';
import { isSymbol } from '@/utils';

export const namespaces = new Map<ClientNamespace, ClientNamespace>();

/**
 * This decorator is used to mark a specific constructor parameter as a cluster client.
 *
 * @param namespace - Client name
 *
 * @public
 */
export const InjectCluster = (namespace: ClientNamespace = DEFAULT_CLUSTER_NAMESPACE): ParameterDecorator => {
  const token = getClusterToken(namespace);
  namespaces.set(namespace, token);
  return Inject(token);
};

/**
 * This function generates an injection token for a cluster client.
 *
 * @param namespace - Client name
 *
 * @public
 */
export const getClusterToken = (namespace: ClientNamespace): ClientNamespace => {
  if (isSymbol(namespace)) return namespace;
  return `${CLUSTER_MODULE_ID}:${namespace}`;
};
