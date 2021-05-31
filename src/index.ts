// export { RedisModule } from './redis/redis.module';
export { RedisError } from './errors/redis.error';
export { DEFAULT_REDIS_CLIENT } from './redis/redis.constants';

// * Types & Interfaces
export {
    ClientNamespace,
    RedisModuleOptions,
    RedisModuleAsyncOptions,
    RedisOptionsFactory
} from './redis/redis-module-options.interface';
