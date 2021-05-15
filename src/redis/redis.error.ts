/**
 * Throws a Error.
 */
export class RedisError extends Error {
    constructor(message: string) {
        super(message);

        this.name = RedisError.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
