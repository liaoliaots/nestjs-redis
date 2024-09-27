/* eslint-disable @typescript-eslint/no-explicit-any */

export type Namespace = string | symbol;

export type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

export type Class<T, Arguments extends unknown[] = any[]> = Constructor<T, Arguments> & { prototype: T };
