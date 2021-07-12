import { ConsoleLogger } from '@nestjs/common';
import { MISSING_REQUIRED_DEPENDENCY } from '../errors';

/**
 * Parses namespace to string.
 *
 * @param namespace - The namespace of client
 */
export const parseNamespace = (namespace: unknown): string => {
    if (typeof namespace === 'string') return namespace;
    if (typeof namespace === 'symbol') return namespace.toString();

    return 'unknown';
};

/**
 * Loads a module from node_modules.
 *
 * @param id - The module name
 */
export const loadModule = (id: string): unknown => {
    try {
        return require(id);
    } catch {
        return null;
    }
};

/**
 * Checks if the given packages are available.
 *
 * @param names - The package names
 */
export const checkPackages = (names: string[]): string[] => {
    const packages = names.map(name => ({
        name,
        pkg: loadModule(name)
    }));

    const missingDependencyNames = packages.filter(({ pkg }) => pkg === null).map(({ name }) => name);

    if (missingDependencyNames.length > 0) {
        const logger = new ConsoleLogger('CheckPackages');

        logger.error(MISSING_REQUIRED_DEPENDENCY(missingDependencyNames));
    }

    return missingDependencyNames;
};
