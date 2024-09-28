/**
 * Thrown when consumer tries to get connection that does not exist.
 */
export class ConnectionNotFoundError extends Error {
  constructor(namespace: string) {
    super(`Connection "${namespace}" was not found.`);
    this.name = this.constructor.name;
  }
}
