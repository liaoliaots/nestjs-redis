export { RedisModule } from './redis/redis.module';
export { DEFAULT_REDIS_CLIENT } from './redis/redis.constants';
export { RedisService } from './redis/redis.service';
export { InjectRedis } from './redis/common';

export { ClusterModule } from './cluster/cluster.module';
export { DEFAULT_CLUSTER_CLIENT } from './cluster/cluster.constants';
export { ClusterService } from './cluster/cluster.service';
export { InjectCluster } from './cluster/common';

// * Types & Interfaces
export { ClientNamespace } from './interfaces';
export { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory } from './redis/interfaces';
export { ClusterModuleOptions, ClusterModuleAsyncOptions, ClusterOptionsFactory } from './cluster/interfaces';
