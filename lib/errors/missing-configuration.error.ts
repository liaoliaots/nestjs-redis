export class MissingConfigurationError extends Error {
    constructor(message: string) {
        super(message);

        this.name = MissingConfigurationError.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
