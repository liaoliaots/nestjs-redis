import { Type, ModuleMetadata } from '@nestjs/common';
import { RedisOptions, Redis } from 'ioredis';

export type ClientNamespace = string | symbol;

export interface ClientOptions extends RedisOptions {
    /**
     * The name of the client, and must be unique.
     */
    namespace?: ClientNamespace;

    /**
     * The URL specifies connection options.
     *
     * - redis:// https://www.iana.org/assignments/uri-schemes/prov/redis
     * - rediss:// https://www.iana.org/assignments/uri-schemes/prov/rediss
     */
    url?: string;

    /**
     * The function will be called when the client has been created, and this client is the first parameter.
     */
    onClientCreated?: (client: Redis) => void;
}

export interface RedisModuleOptions {
    /**
     * If `true`, the connection of every client will be closed automatically on nestjs application shutdown.
     *
     * Default: false
     */
    closeClient?: boolean;

    /**
     * The options of default for every client.
     */
    defaultOptions?: RedisOptions;

    /**
     * Specify a single client or multiple clients.
     */
    config?: ClientOptions | ClientOptions[];
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<RedisOptionsFactory>;
    useClass?: Type<RedisOptionsFactory>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory?: (...args: any[]) => RedisModuleOptions | Promise<RedisModuleOptions>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

export interface RedisOptionsFactory {
    createRedisOptions: () => RedisModuleOptions | Promise<RedisModuleOptions>;
}
