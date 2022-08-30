// Replace `\` with `/` to handle Windows paths
export const normalizeFilePath = (filePath: string) =>
  filePath.replace(/\\/g, '/');

export const isPathInMain = (normalizedFilePath: string) =>
  normalizedFilePath.startsWith('src/main/') || normalizedFilePath.includes('/src/main/') || normalizedFilePath.includes('/src/core/main/');

export const isPathInTest = (normalizedFilePath: string) =>
  normalizedFilePath.startsWith('src/test/') || normalizedFilePath.includes('/src/test/') || (/src\/[\w\/]+\/test\//).test(normalizedFilePath);

export const isPathInDemo = (normalizedFilePath: string) =>
  normalizedFilePath.startsWith('src/demo/') || normalizedFilePath.includes('/src/demo/') || (/src\/[\w\/]+\/demo\//).test(normalizedFilePath);
