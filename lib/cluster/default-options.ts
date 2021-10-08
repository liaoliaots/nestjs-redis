import { ClusterModuleOptions } from './interfaces';

export const defaultClusterModuleOptions: Partial<ClusterModuleOptions> = {
    closeClient: false,
    readyLog: false,
    config: undefined
};
