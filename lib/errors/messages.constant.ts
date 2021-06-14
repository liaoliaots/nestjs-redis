export const CONFIGURATION_MISSING = `configuration is missing, must provide one of useFactory, useClass, and useExisting`;

export const CLIENT_NOT_FOUND = (namespace: string): string =>
    `client ${namespace} provider not found in application context`;

export const TIMEOUT_EXCEEDED = (timeout: number): string => `timeout of ${timeout}ms exceeded`;
