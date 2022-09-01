import { ClientType } from '@/interfaces';

/**
 * Thrown when consumer tries to get client that does not exist.
 */
export class ClientNotFoundError extends Error {
  constructor(namespace: string, type: ClientType) {
    super(
      `The ${
        type === 'redis' ? 'redis' : 'cluster'
      } client "${namespace}" could not be found in the application context.`
    );

    this.name = ClientNotFoundError.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
