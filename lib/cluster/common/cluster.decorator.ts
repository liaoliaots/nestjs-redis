import { Inject } from '@nestjs/common';
import { DEFAULT_CLUSTER_NAMESPACE, DECORATOR_DI_TOKEN_PREFIX } from '../cluster.constants';
import { ClientNamespace } from '@/interfaces';
import { isString, isSymbol } from '@/utils';

export const namespaces = new Map<ClientNamespace, ClientNamespace>();

/**
 * Decorator that marks a constructor parameter as a cluster client.
 *
 * @param namespace - The name of the client
 */
export const InjectCluster = (namespace: ClientNamespace = DEFAULT_CLUSTER_NAMESPACE): ReturnType<typeof Inject> => {
    if (isString(namespace)) {
        const token = getClusterToken(namespace);
        namespaces.set(namespace, token);
        return Inject(token);
    }

    namespaces.set(namespace, namespace);
    return Inject(namespace);
};

/**
 * Gets an internal injection token.
 *
 * @param namespace  - The name of the client
 */
export const getClusterToken = (namespace: ClientNamespace): ClientNamespace => {
    if (isSymbol(namespace)) return namespace;
    return `${DECORATOR_DI_TOKEN_PREFIX}:${namespace}`;
};
