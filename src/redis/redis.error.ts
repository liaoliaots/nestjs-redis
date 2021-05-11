/**
 * Throws a custom error with a 500 status code
 */
export class RedisClientError extends Error {
    constructor(message: string) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
        this.name = RedisClientError.name;
    }
}
