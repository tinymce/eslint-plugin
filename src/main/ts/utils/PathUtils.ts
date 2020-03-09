export const isPathInMain = (filePath: string) => {
  return filePath.startsWith('src/main/') || filePath.indexOf('/src/main/') !== -1;
};
