/**
 * Thrown when async configurations are missing.
 */
export class MissingConfigurationsError extends Error {
  constructor() {
    super(`Missing required asynchronous configurations. Expected one of: "useFactory", "useClass", "useExisting".`);
    this.name = MissingConfigurationsError.name;
  }
}
