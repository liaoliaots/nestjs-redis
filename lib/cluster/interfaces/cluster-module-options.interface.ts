import { Type, ModuleMetadata, Provider } from '@nestjs/common';
import type { Cluster } from 'ioredis';
import { ClusterNode, ClusterOptions } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export interface ClusterClientOptions extends ClusterOptions {
    /**
     * Client name. If client name is not given then it will be called "default".
     * Different clients must have different names.
     */
    namespace?: ClientNamespace;

    /**
     * List of cluster nodes.
     */
    nodes: ClusterNode[];

    /**
     * Function to be executed as soon as the client is created.
     *
     * @param client - The new client
     */
    onClientCreated?: (client: Cluster) => void;
}

export interface ClusterModuleOptions {
    /**
     * If set to `true`, all clients will be closed automatically on nestjs application shutdown. (Default: `true`)
     */
    closeClient?: boolean;

    /**
     * If set to `true` then ready logging will be shown when the client is ready. (Default: `false`)
     */
    readyLog?: boolean;

    /**
     * If set to `true` then error logging will be shown with a built-in logger while connecting. (Default: `true`)
     */
    errorLog?: boolean;

    /**
     * Used to specify single or multiple clients.
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
