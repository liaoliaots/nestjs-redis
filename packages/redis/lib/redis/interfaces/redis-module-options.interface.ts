import { Type, ModuleMetadata, Provider, InjectionToken, OptionalFactoryDependency } from '@nestjs/common';
import type { Redis, RedisOptions } from 'ioredis';
import { Namespace } from '@/interfaces';

export interface RedisClientOptions extends RedisOptions {
  /**
   * Client name. If client name is not given then it will be called "default".
   * Different clients must have different names.
   *
   * @defaultValue `"default"`
   */
  namespace?: Namespace;
  /**
   * URI scheme to be used to specify connection options as a redis:// URL or rediss:// URL.
   *
   * - redis - https://www.iana.org/assignments/uri-schemes/prov/redis
   * - rediss - https://www.iana.org/assignments/uri-schemes/prov/rediss
   *
   * @example
   * ```ts
   * // Connect to 127.0.0.1:6380, db 4, using password "authpassword":
   * 'redis://:authpassword@127.0.0.1:6380/4'
   * ```
   */
  url?: string;
  /**
   * Path to be used for Unix domain sockets.
   */
  path?: string;
  /**
   * Function to be executed as soon as the client is created.
   *
   * @param client - The new client created
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
   * If set to `true`, then ready logging will be displayed when the client is ready.
   *
   * @defaultValue `false`
   */
  readyLog?: boolean;
  /**
   * If set to `true`, then errors that occurred while connecting will be displayed by the built-in logger.
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
  useFactory?: (...args: unknown[]) => RedisModuleOptions | Promise<RedisModuleOptions>;
  useClass?: Type<RedisOptionsFactory>;
  useExisting?: Type<RedisOptionsFactory>;
  inject?: InjectionToken[] | OptionalFactoryDependency[];
  extraProviders?: Provider[];
}

export interface RedisOptionsFactory {
  createRedisOptions: () => RedisModuleOptions | Promise<RedisModuleOptions>;
}
