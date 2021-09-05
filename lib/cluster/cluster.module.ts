import { Module, DynamicModule } from '@nestjs/common';
import { ClusterModuleOptions, ClusterModuleAsyncOptions } from './interfaces';
import { ClusterCoreModule } from './cluster-core.module';

@Module({})
export class ClusterModule {
    /**
     * Registers the module synchronously.
     */
    static forRoot(options: ClusterModuleOptions): DynamicModule {
        return {
            module: ClusterModule,
            imports: [ClusterCoreModule.forRoot(options)]
        };
    }

    /**
     * Registers the module asynchronously.
     */
    static forRootAsync(options?: ClusterModuleAsyncOptions): DynamicModule {
        return {
            module: ClusterModule,
            imports: [ClusterCoreModule.forRootAsync(options)]
        };
    }
}
