export const promiseTimeout = (ms: number, promise: Promise<unknown>): Promise<unknown> => {
    const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject();
        }, ms);
    });

    return Promise.race([timeout, promise]);
};
