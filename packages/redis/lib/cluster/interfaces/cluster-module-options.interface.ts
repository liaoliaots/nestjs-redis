import { Type, ModuleMetadata, Provider, InjectionToken, OptionalFactoryDependency } from '@nestjs/common';
import type { Cluster, ClusterNode, ClusterOptions } from 'ioredis';
import { Namespace } from '@/interfaces';

export interface ClusterClientOptions extends ClusterOptions {
  /**
   * Client name. If client name is not given then it will be called "default".
   * Different clients must have different names.
   *
   * @defaultValue `"default"`
   */
  namespace?: Namespace;
  /**
   * List of cluster nodes.
   *
   * @example
   * ```ts
   * // Connect with url
   * ['redis://:authpassword@127.0.0.1:16380']
   * ```
   *
   * @example
   * ```ts
   * // Connect with host, port
   * [{ host: '127.0.0.1', port: 16380 }]
   * ```
   */
  nodes: ClusterNode[];
  /**
   * Function to be executed as soon as the client is created.
   *
   * @param client - The new client created
   */
  onClientCreated?: (client: Cluster) => void;
}

export interface ClusterModuleOptions {
  /**
   * If set to `true`, all clients will be closed automatically on nestjs application shutdown.
   *
   * @defaultValue `true`
   */
  closeClient?: boolean;
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
  config: ClusterClientOptions | ClusterClientOptions[];
}

export interface ClusterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: unknown[]) => ClusterModuleOptions | Promise<ClusterModuleOptions>;
  useClass?: Type<ClusterOptionsFactory>;
  useExisting?: Type<ClusterOptionsFactory>;
  inject?: InjectionToken[] | OptionalFactoryDependency[];
  extraProviders?: Provider[];
}

export interface ClusterOptionsFactory {
  createClusterOptions: () => ClusterModuleOptions | Promise<ClusterModuleOptions>;
}
