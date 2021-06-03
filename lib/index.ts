export { RedisModule } from './redis/redis.module';
export { DEFAULT_REDIS_CLIENT } from './redis/redis.constants';
export { RedisService } from './redis/redis.service';
export { RedisClient } from './redis/redis.decorator';

// * Types & Interfaces
export {
    ClientNamespace,
    RedisModuleOptions,
    RedisModuleAsyncOptions,
    RedisOptionsFactory
} from './redis/redis-module-options.interface';
