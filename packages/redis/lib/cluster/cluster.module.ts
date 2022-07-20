import { Module, DynamicModule, Provider, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClusterModuleOptions, ClusterModuleAsyncOptions, ClusterClients } from './interfaces';
import { ClusterManager } from './cluster-manager';
import {
  createOptionsProvider,
  createAsyncProviders,
  createClusterClientProviders,
  clusterClientsProvider,
  mergedOptionsProvider
} from './cluster.providers';
import { CLUSTER_CLIENTS, CLUSTER_MERGED_OPTIONS } from './cluster.constants';
import { destroy } from './common';
import { parseNamespace, isResolution, isRejection, isError } from '@/utils';
import { logger } from './cluster-logger';
import { MissingConfigurationsError } from '@/errors';
import { ERROR_LOG } from '@/messages';

/**
 * @public
 */
@Module({})
export class ClusterModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Registers the module synchronously.
   */
  static forRoot(options: ClusterModuleOptions, isGlobal = true): DynamicModule {
    const clusterClientProviders = createClusterClientProviders();
    const providers: Provider[] = [
      createOptionsProvider(options),
      clusterClientsProvider,
      mergedOptionsProvider,
      ClusterManager,
      ...clusterClientProviders
    ];

    return {
      global: isGlobal,
      module: ClusterModule,
      providers,
      exports: [ClusterManager, ...clusterClientProviders]
    };
  }

  /**
   * Registers the module asynchronously.
   */
  static forRootAsync(options: ClusterModuleAsyncOptions, isGlobal = true): DynamicModule {
    if (!options.useFactory && !options.useClass && !options.useExisting) {
      throw new MissingConfigurationsError();
    }

    const clusterClientProviders = createClusterClientProviders();
    const providers: Provider[] = [
      ...createAsyncProviders(options),
      clusterClientsProvider,
      mergedOptionsProvider,
      ClusterManager,
      ...clusterClientProviders,
      ...(options.extraProviders ?? [])
    ];

    return {
      global: isGlobal,
      module: ClusterModule,
      imports: options.imports,
      providers,
      exports: [ClusterManager, ...clusterClientProviders]
    };
  }

  async onApplicationShutdown(): Promise<void> {
    const { closeClient } = this.moduleRef.get<ClusterModuleOptions>(CLUSTER_MERGED_OPTIONS);
    if (closeClient) {
      const results = await destroy(this.moduleRef.get<ClusterClients>(CLUSTER_CLIENTS));
      results.forEach(([namespace, quit]) => {
        if (isResolution(namespace) && isRejection(quit) && isError(quit.reason)) {
          logger.error(ERROR_LOG(parseNamespace(namespace.value), quit.reason.message), quit.reason.stack);
        }
      });
    }
  }
}
