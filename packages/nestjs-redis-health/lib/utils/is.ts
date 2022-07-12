/**
 * Returns `true` if the value is not defined (=== null, === undefined).
 *
 * @param value - Any value
 */
export const isNullish = (value: unknown): value is undefined | null => value === undefined || value === null;
