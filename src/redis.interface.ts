import { Redis, RedisOptions } from 'ioredis';
import { Type, ModuleMetadata } from '@nestjs/common';

/**
 * Interface for redis module options.
 */
export interface RedisModuleOptions {
    /**
     * Client name, must be unique.
     */
    name?: string | symbol | number;
    /**
     * Uses scheme-redis url or scheme-rediss url to specify connection options.
     *
     * - scheme-redis: https://www.iana.org/assignments/uri-schemes/prov/redis
     * - scheme-rediss: https://www.iana.org/assignments/uri-schemes/prov/rediss
     * - ioredis related: https://github.com/luin/ioredis#connect-to-redis
     */
    url?: string;
    /**
     * When a redis instance is created, this method will be called, and the new redis instance as arguments.
     *
     * You can add some logic here, for example:
     * - listen the connection events: https://github.com/luin/ioredis#connection-events
     */
    onClientCreated?: (client: Redis) => void;
    /**
     * Connection options of ioredis: https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options
     */
    redisOptions?: RedisOptions;
}

/**
 * Interface for redis module options factory.
 */
export interface RedisModuleOptionsFactory {
    createRedisModuleOptions():
        | RedisModuleOptions
        | Promise<RedisModuleOptions>
        | RedisModuleOptions[]
        | Promise<RedisModuleOptions[]>;
}

/**
 * Interface for async redis module options.
 */
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<RedisModuleOptionsFactory>;
    useClass?: Type<RedisModuleOptionsFactory>;
    useFactory?: (
        ...args: unknown[]
    ) => RedisModuleOptions | Promise<RedisModuleOptions> | RedisModuleOptions[] | Promise<RedisModuleOptions[]>;
    inject?: unknown[];
}
