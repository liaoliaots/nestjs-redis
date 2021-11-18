export const REDIS_OPTIONS = Symbol();

export const REDIS_INTERNAL_OPTIONS = Symbol();

export const REDIS_CLIENTS = Symbol();

export const DEFAULT_REDIS_NAMESPACE = Symbol('default');

export const REDIS_MODULE_ID = 'RedisModule';

export enum RedisStatus {
    CONNECTING = 'connecting',
    CONNECT = 'connect',
    READY = 'ready',
    END = 'end',
    WAIT = 'wait',
    RECONNECTING = 'reconnecting',
    CLOSE = 'close',
    MONITORING = 'monitoring'
}
