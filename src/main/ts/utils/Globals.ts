import * as path from 'path';
import * as resolve from 'resolve';
import * as ts from 'typescript';

const globalsCache: Record<string, any> = {};

const getVariableExportList = (ast: ts.SourceFile) => {
  const vars: ts.__String[] = [];

  const addVariable = (node: ts.Node) => {
    const name: ts.Identifier = (node as any).name;
    if (name && name.kind === ts.SyntaxKind.Identifier) {
      vars.push(name.escapedText);
    }
  };

  ts.forEachChild(ast, (node) => {
    switch (node.kind) {
      case ts.SyntaxKind.FunctionDeclaration:
      case ts.SyntaxKind.MethodDeclaration:
      case ts.SyntaxKind.PropertyDeclaration:
        addVariable(node);
        break;

      case ts.SyntaxKind.VariableStatement:
        const statement = node as ts.VariableStatement;
        statement.declarationList.declarations.forEach((decl) => {
          addVariable(decl);
        });
        break;
      default:
        break;
    }
  });
  return vars;
};

export const getDomGlobals = (): string[] => {
  if (!globalsCache.hasOwnProperty('dom')) {
    // Resolve the path to the TS dom library types
    const resolved = resolve.sync('typescript');
    const domLib = path.join(path.dirname(resolved), 'lib.dom.d.ts');

    // Parse the types
    const prog = ts.createProgram([ domLib ], {});
    const ast = prog.getSourceFile(domLib);

    // Extract the variables and cache the dom globals lookup
    globalsCache.dom = ast ? getVariableExportList(ast) : [];
  }
  return globalsCache.dom;
};