export const CLUSTER_OPTIONS = Symbol();

export const CLUSTER_INTERNAL_OPTIONS = Symbol();

export const CLUSTER_CLIENTS = Symbol();

export const DEFAULT_CLUSTER_NAMESPACE = Symbol('default');

export const CLUSTER_MODULE_ID = 'ClusterModule';

export enum ClusterStatus {
    END = 'end',
    CLOSE = 'close',
    WAIT = 'wait',
    CONNECTING = 'connecting',
    CONNECT = 'connect',
    READY = 'ready',
    RECONNECTING = 'reconnecting',
    DISCONNECTING = 'disconnecting'
}
