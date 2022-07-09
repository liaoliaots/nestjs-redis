export const timeout = (ms: number) => {
  let timer: NodeJS.Timer;
  return new Promise(resolve => {
    timer = setTimeout(resolve, ms);
  }).finally(() => {
    clearTimeout(timer);
  });
};
