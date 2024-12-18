export const isInternalLibModule = (path: string) => /@(ephox|tiny|tinymce)\/[^/]+\/lib\//.test(path);

export const isInternalSrcModule = (path: string) => /@(ephox|tiny|tinymce)\/[^/]+\/src\//.test(path);

export const isInternalPathAlias = (path: string) => /^(ephox|tiny|tinymce)\//.test(path);

export const isMainImport = (path: string) => path.endsWith('/Main');

export const isPublicApiImport = (path: string) => path.endsWith('/PublicApi');
