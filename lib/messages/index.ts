export const MISSING_CONFIGURATION = `The asynchronous configuration is missing, you must provide one of useFactory, useClass, and useExisting.`;

export const FAILED_CLUSTER_STATE = `Info cluster is not on OK state.`;

export const CANNOT_BE_READ = `Info cluster cannot be read.`;

export const CLIENT_NOT_FOUND_FOR_HEALTH = `The client-provider was not found in the application context.`;

export const CONNECTED_SUCCESSFULLY = `Connected successfully to the server`;

export const CLIENT_NOT_FOUND = (namespace: string, isRedis = true): string => {
    return `The ${
        isRedis ? 'redis' : 'cluster'
    } client-provider '${namespace}' was not found in the application context.`;
};
