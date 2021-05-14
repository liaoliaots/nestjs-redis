/**
 * Checks if given value is empty (=== '', === null, === undefined).
 *
 * @param value - The any value
 */
export const isEmpty = (value: unknown): boolean => value === '' || value === null || value === undefined;

/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 *
 * @param value - The any value
 */
export const isNotEmpty = (value: unknown): boolean => value !== '' && value !== null && value !== undefined;
