export { RedisModule } from './redis/redis.module';
export { DEFAULT_REDIS_NAMESPACE, RedisStatus } from './redis/redis.constants';
export { RedisManager, RedisManager as RedisService } from './redis/redis-manager';
export { InjectRedis, getRedisToken } from './redis/common';
export { ClusterModule } from './cluster/cluster.module';
export { DEFAULT_CLUSTER_NAMESPACE, ClusterStatus } from './cluster/cluster.constants';
export { ClusterManager, ClusterManager as ClusterService } from './cluster/cluster-manager';
export { InjectCluster, getClusterToken } from './cluster/common';

// * Types & Interfaces
export { ClientNamespace } from './interfaces';
export {
    RedisModuleOptions,
    RedisModuleAsyncOptions,
    RedisOptionsFactory,
    RedisClientOptions
} from './redis/interfaces';
export {
    ClusterModuleOptions,
    ClusterModuleAsyncOptions,
    ClusterOptionsFactory,
    ClusterClientOptions
} from './cluster/interfaces';
