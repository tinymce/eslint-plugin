import { TSESTree } from '@typescript-eslint/utils';
import { extractIdentifier, extractMemberIdentifiers } from './ExtractUtils';

export const isEditorMemberExpression = (node: TSESTree.MemberExpression) => {
  const identifier = extractIdentifier(node.object);
  return identifier && (identifier.name === 'ed' || identifier.name === 'editor');
};

export const isEditorFunction = (node: TSESTree.CallExpression, name: string) => {
  const callee = node.callee;
  if (callee.type === TSESTree.AST_NODE_TYPES.MemberExpression && isEditorMemberExpression(callee)) {
    const identifiers = extractMemberIdentifiers(callee);
    return identifiers[1]?.name === name;
  } else {
    return false;
  }
};
