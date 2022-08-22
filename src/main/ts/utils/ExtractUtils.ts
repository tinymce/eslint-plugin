import { Expression, Identifier, MemberExpression, Node, Pattern, PrivateIdentifier, SpreadElement, Super } from 'estree';

export const extractModuleSpecifier = (node: Node) => {
  if (node.type === 'ImportDeclaration') {
    const moduleSource = node.source.value;
    if (typeof moduleSource === 'string') {
      return moduleSource;
    }
  }
  return '';
};

export const extractIdentifier = (node: Expression | PrivateIdentifier | Super | SpreadElement | Pattern | null): Identifier | null => {
  // Node
  if (node?.type === 'Identifier') {
    return node;
    // Node.DOCUMENT_POSITION_PRECEDING
  } else if (node?.type === 'MemberExpression') {
    return extractIdentifier(node.object);
    // ...Node
  } else if (node?.type === 'SpreadElement') {
    return extractIdentifier(node.argument);
  }

  return null;
};

export const extractMemberIdentifiers = (member: MemberExpression): Identifier[] => {
  const identifiers = [];

  // Expand left-hand side
  if (member.object.type === 'Identifier') {
    identifiers.push(member.object);
  } else if (member.object.type === 'MemberExpression') {
    identifiers.push(...extractMemberIdentifiers(member.object));
  }

  // Expand right-hand side
  if (member.property.type === 'Identifier') {
    identifiers.push(member.property);
  }

  return identifiers;
};
