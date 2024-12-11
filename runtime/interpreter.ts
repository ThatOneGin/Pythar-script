import { NumberVal, RuntimeVal, StringVal } from "./values.ts";
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  FunctionDeclaration,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Stmt,
  VarDeclaration,
  StringLiteral,
  IfStmt,
  ForStmt,
  ArrayLiteral,
  MemberExpr,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import {
  eval_for_statement,
  eval_function_declaration,
  eval_if_stmt,
  eval_program,
  eval_var_declaration,
} from "./eval/statements.ts";
import {
  eval_array_expr,
  eval_assignment,
  eval_binary_expr,
  eval_call_expr,
  eval_identifier,
  eval_member_expr,
  eval_object_expr,
} from "./eval/expressions.ts";
import process from "node:process"

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberVal;
    case "StringLiteral":
      return {
        value: ((astNode as StringLiteral).value),
        type: "string"
      } as StringVal;
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);
    case "CallExpr":
      return eval_call_expr(astNode as CallExpr, env);
    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return eval_program(astNode as Program, env);
    case "ArrayLiteral":
      return eval_array_expr(astNode as ArrayLiteral, env);
    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, env);
    case "FunctionDeclaration":
      return eval_function_declaration(astNode as FunctionDeclaration, env);
    case "ForStmt":
      return eval_for_statement(astNode as ForStmt, env);
    case "IfStmt":
      return eval_if_stmt(astNode as IfStmt, env);
    case "MemberExpr":
      return eval_member_expr(env, undefined, astNode as MemberExpr)
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.\n",
        astNode
      );
      process.exit(1);
  }
}