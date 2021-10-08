export const timeout = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms));
