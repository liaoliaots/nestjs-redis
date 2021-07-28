import { Type, ModuleMetadata } from '@nestjs/common';
import { ClusterNode, ClusterOptions, Cluster } from 'ioredis';
import { ClientNamespace } from '../../interfaces';

export interface ClientOptions {
    /**
     * The name of the client, and must be unique.
     */
    namespace?: ClientNamespace;

    /**
     * A list of nodes of the cluster.
     */
    nodes: ClusterNode[];

    /**
     * The cluster options.
     */
    options?: ClusterOptions;

    /**
     * Once the client has been created, this function will be executed immediately.
     *
     * @param client - The client
     */
    onClientCreated?: (client: Cluster) => void;
}

export interface ClusterModuleOptions {
    /**
     * If `true`, all clients will be closed automatically on nestjs application shutdown.
     *
     * Default: false
     */
    closeClient?: boolean;

    /**
     * Specify single or multiple clients.
     */
    config: ClientOptions | ClientOptions[];
}

export interface ClusterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<ClusterOptionsFactory>;
    useClass?: Type<ClusterOptionsFactory>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory?: (...args: any[]) => ClusterModuleOptions | Promise<ClusterModuleOptions>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

export interface ClusterOptionsFactory {
    createClusterOptions: () => ClusterModuleOptions | Promise<ClusterModuleOptions>;
}
