import { Node } from 'estree';

export const extractModuleSpecifier = (node: Node) => {
  if (node.type === 'ImportDeclaration') {
    const moduleSource = node.source.value;
    if (typeof moduleSource === 'string') {
      return moduleSource;
    }
  }
  return '';
};