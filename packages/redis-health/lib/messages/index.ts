export const INVALID_TYPE = `Argument "type" is invalid. Expected one of: "redis", "cluster".`;
export const ABNORMALLY_MEMORY_USAGE = `The client is using abnormally high memory.`;
export const CANNOT_BE_READ = `INFO CLUSTER is null or can't be read.`;
export const FAILED_CLUSTER_STATE = `INFO CLUSTER is not on OK state.`;
export const OPERATIONS_TIMEOUT = (timeout: number) => `Operations timed out after ${String(timeout)}.`;
