import { Cluster } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export type ClusterClients = Map<ClientNamespace, Cluster>;
