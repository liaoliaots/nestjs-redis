import { ClusterModuleOptions } from './interfaces';

export const defaultClusterModuleOptions: Partial<ClusterModuleOptions> = {
  closeClient: true,
  readyLog: false,
  errorLog: true,
  config: undefined
};
