import type { Cluster } from 'ioredis';
import { Namespace } from '@/interfaces';

export type ClusterClients = Map<Namespace, Cluster>;
