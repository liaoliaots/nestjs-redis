/**
 * check if given value is empty (=== '', === null, === undefined)
 */
export const isEmpty = (value: unknown): boolean => value === '' || value === null || value === undefined;

/**
 * check if given value is not empty (!== '', !== null, !== undefined)
 */
export const isNotEmpty = (value: unknown): boolean => value !== '' && value !== null && value !== undefined;
