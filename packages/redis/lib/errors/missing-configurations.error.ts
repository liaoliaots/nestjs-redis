/**
 * Thrown when async configurations are missing.
 */
export class MissingConfigurationsError extends Error {
  constructor() {
    super(`The asynchronous configurations are missing. Expected one of: "useFactory", "useClass", "useExisting".`);

    this.name = MissingConfigurationsError.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
