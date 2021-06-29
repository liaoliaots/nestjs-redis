export const CONFIGURATION_MISSING = `Configuration is missing, must provide one of useFactory, useClass, and useExisting`;

export const CLIENT_NOT_FOUND = (namespace: string, isCluster = false): string =>
    `${isCluster ? 'Cluster' : 'Redis'} client ${namespace} provider not found in application context`;

export const CLUSTER_STATE_FAIL = (namespace: string): string => `cluster client ${namespace} is not on OK state`;
