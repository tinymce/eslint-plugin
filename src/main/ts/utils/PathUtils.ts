export const isPathInMain = (filePath: string) =>
  filePath.startsWith('src/main/') || filePath.includes('/src/main/') || filePath.includes('/src/core/main/');

export const isPathInTest = (filePath: string) =>
  filePath.startsWith('src/test/') || filePath.includes('/src/test/') || (/src\/[\w\/]+\/test\//).test(filePath);

export const isPathInDemo = (filePath: string) =>
  filePath.startsWith('src/demo/') || filePath.includes('/src/demo/') || (/src\/[\w\/]+\/demo\//).test(filePath);
