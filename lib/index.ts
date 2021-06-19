export { RedisModule } from './redis/redis.module';
export { DEFAULT_REDIS_CLIENT } from './redis/redis.constants';
export { RedisService } from './redis/redis.service';
export { InjectRedisClient } from './redis/common';
export { RedisHealthIndicator } from './redis/redis.health';

// * Types & Interfaces
export {
    RedisModuleOptions,
    RedisModuleAsyncOptions,
    RedisOptionsFactory,
    RedisPingCheckOptions
} from './redis/interfaces';
export { ClientNamespace } from './interfaces';
