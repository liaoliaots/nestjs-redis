import { Type, ModuleMetadata } from '@nestjs/common';
import { RedisOptions, Redis } from 'ioredis';
import { ClientNamespace } from '../../interfaces';

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
     * Once the client has been created, this function will be executed immediately.
     *
     * @param client - The client
     */
    onClientCreated?: (client: Redis) => void;
}

export interface RedisModuleOptions {
    /**
     * If `true`, all clients will be closed automatically on nestjs application shutdown.
     *
     * Default: false
     */
    closeClient?: boolean;

    /**
     * The default options for every client.
     */
    defaultOptions?: RedisOptions;

    /**
     * Specify single or multiple clients.
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
