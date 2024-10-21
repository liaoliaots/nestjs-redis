import { Type, ModuleMetadata, Provider, InjectionToken, OptionalFactoryDependency } from '@nestjs/common';
import type { Redis, RedisOptions } from 'ioredis';
import { Namespace } from '@/interfaces';

export interface RedisClientOptions extends RedisOptions {
  /**
   * Name of the connection. If the name is not given then it will be set to "default".
   *
   * Please note that you shouldn't have multiple connections without a namespace, or with the same namespace, otherwise they will get overridden.
   *
   * For the default name you can also explicitly import `DEFAULT_REDIS`.
   *
   * @defaultValue `"default"`
   */
  namespace?: Namespace;
  /**
   * Connection url to be used to specify connection options as a redis:// URL or rediss:// URL when using TLS.
   *
   * - redis - https://www.iana.org/assignments/uri-schemes/prov/redis
   * - rediss - https://www.iana.org/assignments/uri-schemes/prov/rediss
   *
   * @example
   * ```ts
   * // Connect to 127.0.0.1:6380, db 4, using password "authpassword":
   * url: 'redis://:authpassword@127.0.0.1:6380/4'
   * ```
   *
   * @example
   * ```ts
   * // Username can also be passed via URI.
   * url: 'redis://username:authpassword@127.0.0.1:6380/4'
   * ```
   */
  url?: string;
  /**
   * Used to specify the path to Unix domain sockets.
   */
  path?: string;
  /**
   * Manually providing a redis instance.
   *
   * @example
   * ```ts
   * provide() {
   *   // 192.168.1.1:6379
   *   return new Redis(6379, '192.168.1.1');
   * }
   * ```
   */
  provide?: () => Redis;
  /**
   * Called after the connection has been created.
   */
  created?: (client: Redis) => void;
  /**
   * Function to be executed after the connection is created.
   *
   * @deprecated Use the new `created` instead.
   */
  onClientCreated?: (client: Redis) => void;
}

export interface RedisModuleOptions {
  /**
   * If set to `true`, all connections will be closed automatically on nestjs application shutdown.
   *
   * @defaultValue `true`
   */
  closeClient?: boolean;
  /**
   * Common options to be passed to each `config`.
   */
  commonOptions?: RedisOptions;
  /**
   * If set to `true`, then ready logging will be displayed when the connection is ready.
   *
   * @defaultValue `true`
   */
  readyLog?: boolean;
  /**
   * If set to `true`, then errors that occurred while connecting will be displayed by the built-in logger.
   *
   * @defaultValue `true`
   */
  errorLog?: boolean;
  /**
   * Used to specify single or multiple connections.
   */
  config?: RedisClientOptions | RedisClientOptions[];
  /**
   * Called before the connection is created.
   */
  beforeCreate?: () => void;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => RedisModuleOptions | Promise<RedisModuleOptions>;
  useClass?: Type<RedisOptionsFactory>;
  useExisting?: Type<RedisOptionsFactory>;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  extraProviders?: Provider[];
}

export interface RedisOptionsFactory {
  createRedisOptions: () => RedisModuleOptions | Promise<RedisModuleOptions>;
}
