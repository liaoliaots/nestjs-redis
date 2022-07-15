import { ClientType } from '@/interfaces';

/**
 * Thrown when consumer tries to get client that does not exist.
 */
export class ClientNotFoundError extends Error {
  constructor(namespace: string, type: ClientType) {
    super(`${type === 'redis' ? 'Redis' : 'Cluster'} client "${namespace}" was not found in the application context.`);

    this.name = ClientNotFoundError.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
