/**
 * The name of the client.
 */
export type ClientNamespace = string | symbol;

/**
 * Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;
