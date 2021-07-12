export const MISSING_CONFIGURATION = `Configuration is missing, you must provide one of useFactory, useClass, or useExisting`;

export const FAILED_CLUSTER_STATE = `Info cluster is not on OK state`;

export const CLIENT_NOT_FOUND = (namespace: string, isCluster = false): string =>
    `${isCluster ? 'Cluster' : 'Redis'} client ${namespace} provider not found in application context`;

export const MISSING_REQUIRED_DEPENDENCY = (names: string[]): string =>
    `The "${names.join('", "')}" ${names.length > 1 ? 'packages' : 'package'} ${
        names.length > 1 ? 'are' : 'is'
    } missing. Please, make sure to install the ${
        names.length > 1 ? 'libraries' : 'library'
    } ($ npm install --save ${names.join(' ')}).`;
