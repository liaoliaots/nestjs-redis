/**
 * v1.0.0 2021-06-15 16:45
 */

export { RedisModule } from './redis/redis.module';
export { DEFAULT_REDIS_CLIENT } from './redis/redis.constants';
export { RedisService } from './redis/redis.service';
export { InjectRedisClient } from './redis/common';
export { RedisHealthIndicator } from './redis/redis.health';

// * Types & Interfaces
export {
    ClientNamespace,
    RedisModuleOptions,
    RedisModuleAsyncOptions,
    RedisOptionsFactory,
    RedisPingCheckOptions
} from './redis/interfaces';
