import { Module, DynamicModule, Provider, OnApplicationShutdown, Inject } from '@nestjs/common';
import { RedisError } from 'redis-errors';
import { ClusterModuleOptions, ClusterModuleAsyncOptions, ClusterClients } from './interfaces';
import { ClusterManager } from './cluster-manager';
import {
    createOptionsProvider,
    createAsyncProviders,
    createClusterClientProviders,
    clusterClientsProvider
} from './cluster.providers';
import { CLUSTER_OPTIONS, CLUSTER_CLIENTS } from './cluster.constants';
import { quitClients } from './common';
import { MISSING_CONFIGURATION } from '@/messages';
import { parseNamespace } from '@/utils';
import { logger } from './cluster-logger';

@Module({})
export class ClusterModule implements OnApplicationShutdown {
    constructor(
        @Inject(CLUSTER_OPTIONS) private readonly options: ClusterModuleOptions,
        @Inject(CLUSTER_CLIENTS) private readonly clients: ClusterClients
    ) {}

    /**
     * Registers the module synchronously.
     */
    static forRoot(options: ClusterModuleOptions): DynamicModule {
        const clusterClientProviders = createClusterClientProviders();
        const providers: Provider[] = [
            createOptionsProvider(options),
            clusterClientsProvider,
            ClusterManager,
            ...clusterClientProviders
        ];

        return {
            global: true,
            module: ClusterModule,
            providers,
            exports: [ClusterManager, ...clusterClientProviders]
        };
    }

    /**
     * Registers the module asynchronously.
     */
    static forRootAsync(options: ClusterModuleAsyncOptions): DynamicModule {
        if (!options.useFactory && !options.useClass && !options.useExisting) {
            throw new RedisError(MISSING_CONFIGURATION);
        }

        const clusterClientProviders = createClusterClientProviders();
        const providers: Provider[] = [
            ...createAsyncProviders(options),
            clusterClientsProvider,
            ClusterManager,
            ...clusterClientProviders,
            ...(options.extraProviders ?? [])
        ];

        return {
            global: true,
            module: ClusterModule,
            imports: options.imports,
            providers,
            exports: [ClusterManager, ...clusterClientProviders]
        };
    }

    async onApplicationShutdown(): Promise<void> {
        if (this.options.closeClient) {
            const result = await quitClients(this.clients);
            result.forEach(([namespace, quit]) => {
                if (namespace.status === 'fulfilled' && quit.status === 'rejected' && quit.reason instanceof Error) {
                    logger.error(`${parseNamespace(namespace.value)}: ${quit.reason.message}`);
                }
            });
        }
    }
}
