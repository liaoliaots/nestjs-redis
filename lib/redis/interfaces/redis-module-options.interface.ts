import { Type, ModuleMetadata, Provider } from '@nestjs/common';
import type Redis from 'ioredis';
import { RedisOptions } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export interface RedisClientOptions extends RedisOptions {
    /**
     * Client name. If client name is not given then it will be called "default".
     * Different clients must have different names.
     */
    namespace?: ClientNamespace;

    /**
     * URL used to specify connection options.
     *
     * - redis:// https://www.iana.org/assignments/uri-schemes/prov/redis
     * - rediss:// https://www.iana.org/assignments/uri-schemes/prov/rediss
     */
    url?: string;

    /**
     * Path to be used for Unix domain socket.
     */
    path?: string;

    /**
     * Function to be executed as soon as the client is created.
     *
     * @param client - The new client
     *
     * @deprecated Pointless function, just for compatibility.
     */
    onClientCreated?: (client: Redis) => void;
}

export interface RedisModuleOptions {
    /**
     * If set to `true`, all clients will be closed automatically on nestjs application shutdown.
     *
     * @defaultValue `true`
     */
    closeClient?: boolean;

    /**
     * Common options to be passed to each client.
     */
    commonOptions?: RedisOptions;

    /**
     * If set to `true` then ready logging will be shown when the client is ready.
     *
     * @defaultValue `false`
     */
    readyLog?: boolean;

    /**
     * If set to `true` then error logging will be shown with a built-in logger while connecting.
     *
     * @defaultValue `true`
     */
    errorLog?: boolean;

    /**
     * Used to specify single or multiple clients.
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
