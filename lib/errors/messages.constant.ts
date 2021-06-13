import { parseNamespace } from '../redis/common';
import { ClientNamespace } from '../redis/interfaces';

export const CONFIGURATION_MISSING = `configuration is missing, must provide one of useFactory, useClass, and useExisting`;

export const CLIENT_NOT_FOUND = (namespace: ClientNamespace): string =>
    `client ${parseNamespace(namespace)} provider not found in application context`;

export const TIMEOUT_EXCEEDED = (timeout: number): string => `timeout of ${timeout}ms exceeded`;
