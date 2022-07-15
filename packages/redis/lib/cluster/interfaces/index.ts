import type { Cluster } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export * from './cluster-module-options.interface';

export type ClusterClients = Map<ClientNamespace, Cluster>;
