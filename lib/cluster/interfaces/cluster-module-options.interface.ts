import { Type, ModuleMetadata, Provider } from '@nestjs/common';
import { ClusterNode, ClusterOptions, Cluster } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export interface ClusterClientOptions {
    /**
     * The name of the client, and must be unique.
     */
    namespace?: ClientNamespace;
    /**
     * A list of nodes of the cluster.
     */
    nodes: ClusterNode[];
    /**
     * The options of the cluster.
     */
    options?: ClusterOptions;
    /**
     * This function will be executed as soon as the client is created.
     *
     * @param client - The new client
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
     * If `true`, will show a message when the client is ready.
     *
     * Default: false
     */
    readyLog?: boolean;
    /**
     * Specify single or multiple clients.
     */
    config: ClusterClientOptions | ClusterClientOptions[];
}

export interface ClusterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<ClusterOptionsFactory>;
    useClass?: Type<ClusterOptionsFactory>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory?: (...args: any[]) => ClusterModuleOptions | Promise<ClusterModuleOptions>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    extraProviders?: Provider[];
}

export interface ClusterOptionsFactory {
    createClusterOptions: () => ClusterModuleOptions | Promise<ClusterModuleOptions>;
}
