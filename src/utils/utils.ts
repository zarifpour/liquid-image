export const msg = (message: string) => {
  return `💧 LiquidImage: ${message}`;
};

export const consoleError = (message: string, ...args: unknown[]) => {
  console.error(msg(message), ...args);
};

export const consoleLog = (message: string, ...args: unknown[]) => {
  console.log(msg(message), ...args);
};
