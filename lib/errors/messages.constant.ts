export const MISSING_CONFIGURATION = `Configuration is missing, you must provide one of useFactory, useClass, or useExisting`;

export const FAILED_CLUSTER_STATE = `Info cluster is not on OK state`;

export const CLIENT_NOT_FOUND = (namespace: string, isCluster = false): string =>
    `The client-provider ${namespace} of ${isCluster ? 'cluster' : 'redis'} not found in the application context`;
