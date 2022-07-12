export const CONNECTED_SUCCESSFULLY = `Connected successfully and ready to receive commands`;
export const READY_LOG = (namespace: string) => `${namespace}: ${CONNECTED_SUCCESSFULLY}`;
export const ERROR_LOG = (namespace: string, message: string) => `${namespace}: ${message}`;
