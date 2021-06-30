export const CONFIGURATION_MISSING = `Configuration is missing, you must provide one of useFactory, useClass, or useExisting`;

export const CLUSTER_STATE_FAIL = `info cluster is not on OK state`;

export const CLIENT_NOT_FOUND = (namespace: string, isCluster = false): string =>
    `${isCluster ? 'Cluster' : 'Redis'} client ${namespace} provider not found in application context`;
