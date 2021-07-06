import { Module, Global, DynamicModule, Provider, OnApplicationShutdown, Inject } from '@nestjs/common';
import { ClusterModuleOptions, ClusterModuleAsyncOptions, ClusterClients } from './interfaces';
import { ClusterService } from './cluster.service';
import { createProviders, createAsyncProviders, createClusterClientProviders } from './cluster.providers';
import { CLUSTER_OPTIONS, CLUSTER_CLIENTS } from './cluster.constants';
import { ClusterHealthIndicator } from './cluster.health';
import { quitClients } from './common';
import { checkPackages } from '../utils';

@Global()
@Module({})
export class ClusterCoreModule implements OnApplicationShutdown {
    constructor(
        @Inject(CLUSTER_OPTIONS) private readonly options: ClusterModuleOptions,
        @Inject(CLUSTER_CLIENTS) private readonly clients: ClusterClients
    ) {
        checkPackages(['ioredis', '@nestjs/terminus']);
    }

    static forRoot(options: ClusterModuleOptions): DynamicModule {
        const clusterClientProviders = createClusterClientProviders();
        const providers: Provider[] = [
            ...createProviders(options),
            ClusterService,
            ClusterHealthIndicator,
            ...clusterClientProviders
        ];

        return {
            module: ClusterCoreModule,
            providers,
            exports: [ClusterService, ClusterHealthIndicator, ...clusterClientProviders]
        };
    }

    static forRootAsync(options: ClusterModuleAsyncOptions): DynamicModule {
        const clusterClientProviders = createClusterClientProviders();
        const providers: Provider[] = [
            ...createAsyncProviders(options),
            ClusterService,
            ClusterHealthIndicator,
            ...clusterClientProviders
        ];

        return {
            module: ClusterCoreModule,
            imports: options.imports,
            providers,
            exports: [ClusterService, ClusterHealthIndicator, ...clusterClientProviders]
        };
    }

    onApplicationShutdown(): void {
        if (this.options.closeClient) quitClients(this.clients);
    }
}
