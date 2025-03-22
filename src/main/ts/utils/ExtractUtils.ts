import { TSESTree } from '@typescript-eslint/utils';

export const extractModuleSpecifier = (node: TSESTree.Node) => {
  if (node.type === TSESTree.AST_NODE_TYPES.ImportDeclaration) {
    const moduleSource = node.source.value;
    if (typeof moduleSource === 'string') {
      return moduleSource;
    }
  }
  return '';
};

type Pattern = TSESTree.ArrayPattern | TSESTree.ObjectPattern | TSESTree.AssignmentPattern | TSESTree.BindingPattern | TSESTree.DestructuringPattern;

export const extractIdentifier = (
  node: TSESTree.Expression | TSESTree.TSEmptyBodyFunctionExpression | TSESTree.PrivateIdentifier | TSESTree.Super | TSESTree.SpreadElement | Pattern | null
): TSESTree.Identifier | null => {
  // Node
  if (node?.type === TSESTree.AST_NODE_TYPES.Identifier) {
    return node;
    // Node.DOCUMENT_POSITION_PRECEDING
  } else if (node?.type === TSESTree.AST_NODE_TYPES.MemberExpression) {
    return extractIdentifier(node.object);
    // ...Node
  } else if (node?.type === TSESTree.AST_NODE_TYPES.SpreadElement) {
    return extractIdentifier(node.argument);
  }

  return null;
};

export const extractMemberIdentifiers = (member: TSESTree.MemberExpression): TSESTree.Identifier[] => {
  const identifiers: TSESTree.Identifier[] = [];

  // Expand left-hand side
  if (member.object.type === TSESTree.AST_NODE_TYPES.Identifier) {
    identifiers.push(member.object);
  } else if (member.object.type === TSESTree.AST_NODE_TYPES.MemberExpression) {
    identifiers.push(...extractMemberIdentifiers(member.object));
  }

  // Expand right-hand side
  if (member.property.type === TSESTree.AST_NODE_TYPES.Identifier) {
    identifiers.push(member.property);
  }

  return identifiers;
};
