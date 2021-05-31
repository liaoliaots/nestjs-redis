/**
 * Throws an Error with a 500 status code.
 */
export class RedisError extends Error {
    constructor(message: string) {
        super(message);

        this.name = RedisError.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
