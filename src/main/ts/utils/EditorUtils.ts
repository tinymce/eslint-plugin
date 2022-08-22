import { CallExpression, MemberExpression } from 'estree';
import { extractIdentifier, extractMemberIdentifiers } from './ExtractUtils';

export const isEditorMemberExpression = (node: MemberExpression) => {
  const identifier = extractIdentifier(node.object);
  return identifier && (identifier.name === 'ed' || identifier.name === 'editor');
};

export const isEditorFunction = (node: CallExpression, name: string) => {
  const callee = node.callee;
  if (callee.type === 'MemberExpression' && isEditorMemberExpression(callee)) {
    const identifiers = extractMemberIdentifiers(callee);
    return identifiers[1]?.name === name;
  } else {
    return false;
  }
};