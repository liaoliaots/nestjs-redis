export const MISSING_CONFIGURATION = `Asynchronous configurations are missing, you must provide one of 'useFactory', 'useClass', and 'useExisting'.`;
export const CONNECTED_SUCCESSFULLY = `Connected successfully to the server`;
export const CLIENT_NOT_FOUND = (namespace: string, isRedis = true): string =>
    `${isRedis ? 'Redis' : 'Cluster'} client '${namespace}' not found in the application context.`;

export const MISSING_CLIENT = `This client does not exist.`;
export const NOT_RESPONSIVE = `This client is not responsive.`;
export const ABNORMALLY_MEMORY_USAGE = `This client is using abnormally high memory.`;
export const CANNOT_BE_READ = `Info cluster cannot be read.`;
export const FAILED_CLUSTER_STATE = `Info cluster is not on OK state.`;
