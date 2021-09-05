export { RedisModule } from './redis/redis.module';
export { DEFAULT_REDIS_NAMESPACE } from './redis/redis.constants';
export { RedisService } from './redis/redis.service';
export { InjectRedis, getRedisToken } from './redis/common';

export { ClusterModule } from './cluster/cluster.module';
export { DEFAULT_CLUSTER_NAMESPACE } from './cluster/cluster.constants';
export { ClusterService } from './cluster/cluster.service';
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
