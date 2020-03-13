export const isPathInMain = (filePath: string) => {
  return filePath.startsWith('src/main/') || filePath.includes('/src/main/');
};
