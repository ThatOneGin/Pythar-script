export type NodeType =
  | "Program"
  | "VarDeclaration"
  | "FunctionDeclaration"
  | "AssignmentExpr"
  | "MemberExpr"
  | "CallExpr"
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral"
  | "Identifier"
  | "StringLiteral"
  | "IfStmt"
  | "ForStmt"
  | "ArrayLiteral"
  | "ReturnExpr"
  | "BinaryExpr";

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface VarDeclaration extends Stmt {
  kind: "VarDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr;
}

export interface FunctionDeclaration extends Stmt {
  kind: "FunctionDeclaration";
  parameters: string[];
  name: string;
  body: Stmt[];
}


export interface Expr extends Stmt {
  symbol?: any;
  right?: any;
  value?: any
}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assigne: Expr;
  value: Expr;
}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Expr;
}

export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
}

export interface IfStmt extends Stmt {
  kind: "IfStmt";
  test: Expr;
  body: Stmt[];
  alt?: Stmt[];
}

export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[];
}

export interface StringLiteral extends Expr {
  kind: "StringLiteral";
  value: string;
}

export interface ArrayLiteral extends Expr {
  kind: "ArrayLiteral";
  value: Array<Expr>
}

export interface ForStmt extends Stmt {
  kind: "ForStmt";
  init: VarDeclaration;
  test: Expr;
  upd: AssignmentExpr;
  body: Stmt[];
}

export interface ReturnExpr extends Expr {
  kind: "ReturnExpr";
  toreturn: Expr;
}