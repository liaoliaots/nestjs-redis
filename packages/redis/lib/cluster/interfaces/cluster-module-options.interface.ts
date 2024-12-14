import { Type, ModuleMetadata, Provider, InjectionToken, OptionalFactoryDependency } from '@nestjs/common';
import type { Cluster, ClusterNode, ClusterOptions } from 'ioredis';
import { Namespace } from '@/interfaces';

export interface ClusterClientOptions extends ClusterOptions {
  /**
   * Name of the client. If the name is not given then it will be set to "default".
   *
   * Please note that you shouldn't have multiple connections without a namespace, or with the same namespace, otherwise they will get overridden.
   *
   * For the default name you can also explicitly import `DEFAULT_CLUSTER`.
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
   * nodes: ['redis://:authpassword@127.0.0.1:16380']
   * ```
   *
   * @example
   * ```ts
   * // Connect with host, port
   * nodes: [
   *   {
   *     port: 6380,
   *     host: '127.0.0.1'
   *   },
   *   {
   *     port: 6381,
   *     host: '127.0.0.1'
   *   }
   * ]
   * ```
   */
  nodes: ClusterNode[];
  /**
   * Called after the client has been created.
   */
  created?: (client: Cluster) => void;
  /**
   * Function to be executed after the client is created.
   *
   * @deprecated Use the new `created` instead.
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
   * Used to specify single or multiple clients.
   */
  config: ClusterClientOptions | ClusterClientOptions[];
}

export interface ClusterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: unknown[]) => ClusterModuleOptions | Promise<ClusterModuleOptions>;
  useClass?: Type<ClusterOptionsFactory>;
  useExisting?: Type<ClusterOptionsFactory>;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  extraProviders?: Provider[];
}

export interface ClusterOptionsFactory {
  createClusterOptions: () => ClusterModuleOptions | Promise<ClusterModuleOptions>;
}
