export const MISSING_CONFIGURATION = `Configuration is missing, you must provide one of useFactory, useClass, or useExisting.`;

export const FAILED_CLUSTER_STATE = `Info cluster is not on OK state.`;

export const CANNOT_BE_READ = `Info cluster cannot be read.`;

export const CLIENT_NOT_FOUND_FOR_HEALTH = `The client-provider is not found in the application context.`;

export const CLIENT_NOT_FOUND = (namespace: string, isRedis = true): string =>
    `The ${isRedis ? 'redis' : 'cluster'} client-provider '${namespace}' is not found in the application context.`;
