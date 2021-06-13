import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class ClusterModule {
    /**
     * Registers the module synchronously.
     */
    static forRoot(): DynamicModule {
        return {
            module: ClusterModule,
            imports: []
        };
    }

    /**
     * Registers the module asynchronously.
     */
    static forRootAsync(): DynamicModule {
        return {
            module: ClusterModule,
            imports: []
        };
    }
}
