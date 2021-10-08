import { Type, ModuleMetadata, Provider } from '@nestjs/common';
import { RedisOptions, Redis } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export interface RedisClientOptions extends RedisOptions {
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
     * This function will be executed as soon as the client is created.
     *
     * @param client - The new client
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
     * The common options for each client.
     */
    commonOptions?: RedisOptions;
    /**
     * If `true`, will show a message when the client is ready.
     *
     * Default: false
     */
    readyLog?: boolean;
    /**
     * Specify single or multiple clients.
     */
    config?: RedisClientOptions | RedisClientOptions[];
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<RedisOptionsFactory>;
    useClass?: Type<RedisOptionsFactory>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory?: (...args: any[]) => RedisModuleOptions | Promise<RedisModuleOptions>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    extraProviders?: Provider[];
}

export interface RedisOptionsFactory {
    createRedisOptions: () => RedisModuleOptions | Promise<RedisModuleOptions>;
}
