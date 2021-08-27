import { Inject } from '@nestjs/common';
import { ClientNamespace } from '@/interfaces';
import { DEFAULT_CLUSTER_NAMESPACE } from '../cluster.constants';

export const namespaces: ClientNamespace[] = [];

export const InjectCluster = (namespace: ClientNamespace = DEFAULT_CLUSTER_NAMESPACE): ReturnType<typeof Inject> => {
    if (!namespaces.includes(namespace)) namespaces.push(namespace);

    return Inject(namespace);
};
