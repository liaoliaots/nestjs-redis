import { Type, ModuleMetadata } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

/**
 * Type for client name.
 */
export type ClientNamespace = string | symbol;

/**
 * Interface for the options of redis module.
 */
export interface RedisModuleOptions extends RedisOptions {
    /**
     * The client name must be unique.
     */
    namespace?: ClientNamespace;
    /**
     * The redis:// URL or rediss:// URL to specify connection options.
     * - redis:// https://www.iana.org/assignments/uri-schemes/prov/redis
     * - rediss:// https://www.iana.org/assignments/uri-schemes/prov/rediss
     */
    url?: string;
}

/**
 * Interface for the async options of redis module.
 */
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<RedisOptionsFactory>;
    useClass?: Type<RedisOptionsFactory>;
    useFactory?: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
    ) => RedisModuleOptions | Promise<RedisModuleOptions> | RedisModuleOptions[] | Promise<RedisModuleOptions[]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

/**
 * Interface for the factory class of redis module options.
 */
export interface RedisOptionsFactory {
    createRedisModuleOptions():
        | RedisModuleOptions
        | Promise<RedisModuleOptions>
        | RedisModuleOptions[]
        | Promise<RedisModuleOptions[]>;
}
