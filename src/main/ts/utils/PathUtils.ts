// Replace `\` with `/` to handle Windows paths
const normalizeFilePath = (filePath: string) =>
  filePath.replace(/\\/g, '/');

export const isPathInMain = (filePath: string) => {
  const normalizedPath = normalizeFilePath(filePath);
  return normalizedPath.startsWith('src/main/') || normalizedPath.includes('/src/main/') || normalizedPath.includes('/src/core/main/');
};

export const isPathInTest = (filePath: string) => {
  const normalizedPath = normalizeFilePath(filePath);
  return normalizedPath.startsWith('src/test/') || normalizedPath.includes('/src/test/') || (/src\/[\w\/]+\/test\//).test(normalizedPath);
};

export const isPathInDemo = (filePath: string) => {
  const normalizedPath = normalizeFilePath(filePath);
  return normalizedPath.startsWith('src/demo/') || normalizedPath.includes('/src/demo/') || (/src\/[\w\/]+\/demo\//).test(normalizedPath);
};
