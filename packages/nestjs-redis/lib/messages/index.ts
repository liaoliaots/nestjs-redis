export const CONNECTED_SUCCESSFULLY = `Connected successfully and ready to receive commands`;
export const READY_LOG = (namespace: string) => `${namespace}: ${CONNECTED_SUCCESSFULLY}`;
export const ERROR_LOG = (namespace: string, message: string) => `${namespace}: ${message}`;

export const MISSING_TYPE = `Argument "type" is missing.`;
export const INVALID_TYPE = `Argument "type" is invalid. Expected one of: "redis", "cluster".`;
export const NOT_RESPONSIVE = `The client is not responsive.`;
export const ABNORMALLY_MEMORY_USAGE = `The client is using abnormally high memory.`;
export const CANNOT_BE_READ = `Info cluster cannot be read.`;
export const FAILED_CLUSTER_STATE = `Info cluster is not in OK state.`;
export const OPERATIONS_TIMEOUT = (timeout: number) =>
  `Operations timed out after ${String(timeout)} millisecond${timeout > 1 ? 's' : ''}.`;
