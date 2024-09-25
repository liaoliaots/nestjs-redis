/**
 * Thrown when consumer tries to get client that does not exist.
 */
export class ClientNotFoundError extends Error {
  constructor(namespace: string) {
    super(`Connection "${namespace}" was not found.`);
    this.name = ClientNotFoundError.name;
  }
}
