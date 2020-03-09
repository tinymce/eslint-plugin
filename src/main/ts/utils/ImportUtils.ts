export const isInternalLibModule = (path: string) => {
  return /@(ephox|tiny|tinymce)\/[^\/]+\/lib\//.test(path);
};

export const isInternalSrcModule = (path: string) => {
  return /@(ephox|tiny|tinymce)\/[^\/]+\/src\//.test(path);
};

export const isInternalPathAlias = (path: string) => {
  return /^(ephox|tiny|tinymce)\//.test(path);
};

export const isMainImport = (path: string) => {
  return path.endsWith('/Main');
};

export const trimModulePath = (path: string) => {
  return path.replace(/['"]/g, '');
};
