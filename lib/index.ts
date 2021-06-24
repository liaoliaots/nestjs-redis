export { RedisModule } from './redis/redis.module';
export { DEFAULT_REDIS_CLIENT } from './redis/redis.constants';
export { RedisService } from './redis/redis.service';
export { InjectRedisClient } from './redis/common';
export { RedisHealthIndicator } from './redis/redis.health';

export { ClusterModule } from './cluster/cluster.module';
export { DEFAULT_CLUSTER_CLIENT } from './cluster/cluster.constants';
export { ClusterService } from './cluster/cluster.service';
export { InjectClusterClient } from './cluster/common';
export { ClusterHealthIndicator } from './cluster/cluster.health';

export { ClientNamespace } from './interfaces';
export {
    RedisModuleOptions,
    RedisModuleAsyncOptions,
    RedisOptionsFactory,
    RedisPingCheckOptions
} from './redis/interfaces';
export {
    ClusterModuleOptions,
    ClusterModuleAsyncOptions,
    ClusterOptionsFactory,
    ClusterPingCheckOptions
} from './cluster/interfaces';
