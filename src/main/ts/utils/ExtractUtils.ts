import { Expression, Identifier, Node, Pattern, SpreadElement, Super } from 'estree';

export const extractModuleSpecifier = (node: Node) => {
  if (node.type === 'ImportDeclaration') {
    const moduleSource = node.source.value;
    if (typeof moduleSource === 'string') {
      return moduleSource;
    }
  }
  return '';
};

export const extractIdentifier = (node: Expression | Super | SpreadElement | Pattern): Identifier | null => {
  // Node
  if (node.type === 'Identifier') {
    return node;
    // Node.DOCUMENT_POSITION_PRECEDING
  } else if (node.type === 'MemberExpression') {
    return extractIdentifier(node.object);
    // a = Node
  } else if (node.type === 'AssignmentExpression') {
    return extractIdentifier(node.right);
    // ...Node
  } else if (node.type === 'SpreadElement') {
    return extractIdentifier(node.argument);
  }

  return null;
};