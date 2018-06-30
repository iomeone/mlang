import * as AST from "./ast";
import { Visitor } from "./visitor";

export class VarSymbol {
  name: string;
  type: BuiltinSymbol;

  constructor(name: string, type: BuiltinSymbol) {
    this.name = name;
    this.type = type;
  }
}

export class BuiltinSymbol {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static getBuiltinSymbols() {
    return {
      INTEGER: new BuiltinSymbol("INTEGER"),
      REAL: new BuiltinSymbol("REAL")
    };
  }
}

export class SymbolTable {
  builtins: { [key: string]: BuiltinSymbol };
  symbols: { [key: string]: VarSymbol };

  constructor() {
    this.builtins = BuiltinSymbol.getBuiltinSymbols();
    this.symbols = {};
  }

  define(name: string, type: BuiltinSymbol) {
    this.symbols[name] = new VarSymbol(name, type);
  }

  lookup(name: string) {
    return this.symbols[name];
  }
}

export class SemanticAnalyzer extends Visitor {
  ast: AST.ProgramNode;
  symbolTable: SymbolTable;

  constructor(ast: AST.ProgramNode) {
    super();

    this.ast = ast;
    this.symbolTable = new SymbolTable();
  }

  execute() {
    this.visit(this.ast);
  }

  visitVariableDeclaration({ name, type }: AST.VariableDeclarationNode) {
    if (this.symbolTable.lookup(name.token.value)) {
      throw new Error(`${name.token.value} is already declared`);
    }
    let typeSymbol = this.symbolTable.builtins[type.token.value];
    this.symbolTable.define(name.token.value, typeSymbol);
  }

  visitAssignment({ variable, expression }: AST.AssignmentNode) {
    if (!this.symbolTable.lookup(variable.token.value)) {
      throw new Error(`${variable.token.value} is not defined`);
    }
    this.visit(expression);
  }

  visitVariable(node: AST.TokenNode) {
    if (!this.symbolTable.lookup(node.token.value)) {
      throw new Error(`${node.token.value} is not defined`);
    }
  }
}
