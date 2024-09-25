import { Module, DynamicModule, Provider, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClusterModuleOptions, ClusterModuleAsyncOptions, ClusterClients } from './interfaces';
import { ClusterService } from './cluster.service';
import {
  createOptionsProvider,
  createAsyncProviders,
  clusterClientsProvider,
  mergedOptionsProvider
} from './cluster.providers';
import { CLUSTER_CLIENTS, CLUSTER_MERGED_OPTIONS } from './cluster.constants';
import { parseNamespace, isError } from '@/utils';
import { logger } from './cluster-logger';
import { MissingConfigurationsError } from '@/errors';
import { ERROR_LOG } from '@/messages';

@Module({})
export class ClusterModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Registers the module synchronously.
   *
   * @param options - The module options
   * @param isGlobal - Register in the global scope
   * @returns A DynamicModule
   */
  static forRoot(options: ClusterModuleOptions, isGlobal = true): DynamicModule {
    const providers: Provider[] = [
      createOptionsProvider(options),
      clusterClientsProvider,
      mergedOptionsProvider,
      ClusterService
    ];

    return {
      global: isGlobal,
      module: ClusterModule,
      providers,
      exports: [ClusterService]
    };
  }

  /**
   * Registers the module asynchronously.
   *
   * @param options - The async module options
   * @param isGlobal - Register in the global scope
   * @returns A DynamicModule
   */
  static forRootAsync(options: ClusterModuleAsyncOptions, isGlobal = true): DynamicModule {
    if (!options.useFactory && !options.useClass && !options.useExisting) {
      throw new MissingConfigurationsError();
    }

    const providers: Provider[] = [
      ...createAsyncProviders(options),
      clusterClientsProvider,
      mergedOptionsProvider,
      ClusterService,
      ...(options.extraProviders ?? [])
    ];

    return {
      global: isGlobal,
      module: ClusterModule,
      imports: options.imports,
      providers,
      exports: [ClusterService]
    };
  }

  async onApplicationShutdown(): Promise<void> {
    const { closeClient } = this.moduleRef.get<ClusterModuleOptions>(CLUSTER_MERGED_OPTIONS, { strict: false });
    if (closeClient) {
      const clients = this.moduleRef.get<ClusterClients>(CLUSTER_CLIENTS, { strict: false });
      for (const [namespace, client] of clients) {
        if (client.status === 'end') continue;
        if (client.status === 'ready') {
          try {
            await client.quit();
          } catch (e) {
            if (isError(e)) logger.error(ERROR_LOG(parseNamespace(namespace), e.message), e.stack);
          }
          continue;
        }
        client.disconnect();
      }
    }
  }
}
