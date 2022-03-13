export const MISSING_CONFIGURATION =
    'Asynchronous configurations are missing. Expected one of: `useFactory`, `useClass`, `useExisting`.';
export const CONNECTED_SUCCESSFULLY = `Connected successfully to the server`;
export const CLIENT_NOT_FOUND = (namespace: string, isRedis = true): string =>
    `${isRedis ? 'Redis' : 'Cluster'} client \`${namespace}\` not found in the application context.`;

export const MISSING_CLIENT = 'Argument `client` is missing.';
export const MISSING_TYPE = 'Argument `type` is missing.';
export const NOT_RESPONSIVE = `The client is not responsive.`;
export const ABNORMALLY_MEMORY_USAGE = `The client is using abnormally high memory.`;
export const CANNOT_BE_READ = `Info cluster cannot be read.`;
export const FAILED_CLUSTER_STATE = `Info cluster is not in OK state.`;
export const OPERATIONS_TIMEOUT = (timeout: number) => `Operations timed out after ${String(timeout)}ms.`;
