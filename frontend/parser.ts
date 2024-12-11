// deno-lint-ignore-file no-explicit-any
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Expr,
  Identifier,
  MemberExpr,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
  Stmt,
  IfStmt,
  VarDeclaration,
  FunctionDeclaration,
  StringLiteral,
  ForStmt,
  ReturnExpr,
} from "../frontend/ast.ts";
import { Token, tokenize, TokenType } from "../frontend/lexer.ts";
import process from "node:process"

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at() {
    return this.tokens[0] as Token;
  }

  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect(type: TokenType, err: any) {
    const prev = (this.tokens.shift() as Token);
    if (!prev || prev.type != type) {
      console.error("Parser Error:\n", err, "\"" + prev.value + "\"", " - Expecting: ", type);
      process.exit(1);
    }

    return prev;
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };
    // Parse until end of file
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  private parse_stmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Var:
        return this.parse_var_keyword();
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declaration();
      case TokenType.Fn:
        return this.parse_fn_declaration();
      case TokenType.If:
        return this.parse_if_statement();
      case TokenType.For:
        return this.parse_for_statement();
      case TokenType.Return:
        return this.parse_return_expr();
      default:
        return this.parse_expr();
    }
  }

  parse_fn_declaration(): Stmt {
    this.eat(); // eat fn keyword
    const name = this.at().type == TokenType.Identifier ? this.eat().value : "<anonymous>"

    const args = this.parse_args();
    const params: string[] = [];

    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        console.log("=>" + arg);
        throw "Expected identifier inside function parameters.";
      }

      params.push((arg as Identifier).symbol);
    }

    const body = this.parse_codeblock_stmt();

    const fn = {
      body,
      name,
      parameters: params,
      kind: "FunctionDeclaration",
    } as FunctionDeclaration;

    return fn;
  }

  private parse_var_keyword(): Stmt {
    this.eat(); // eat var key, you dont need it anyways.
    const ismutornot = this.eat().type != TokenType.Mutable

    const identifier = this.expect(TokenType.Identifier, "Expected identifier following var declaration.").value

    if (this.at().type == TokenType.Semicolon) {
      this.eat();
      if (ismutornot) {
        throw "Must Assign value to constant variable."
      }

      return {
        kind: "VarDeclaration",
        identifier: identifier,
        constant: ismutornot,
      } as VarDeclaration;
    }
    this.expect(TokenType.Equals, "Expected \"=\" in " + identifier)
    const declaration = {
      kind: "VarDeclaration",
      identifier: identifier,
      constant: ismutornot,
      value: this.parse_expr()
    } as VarDeclaration;

    this.expect(TokenType.Semicolon, "Expected \; following var expression")

    return declaration;
  }

  parse_var_declaration(): Stmt {
    const isConstant = this.eat().type == TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected identifier name following let | const keywords."
    ).value;

    if (this.at().type == TokenType.Semicolon) {
      this.eat(); // expect semicolon
      if (isConstant) {
        throw "Must assigne value to constant expression. No value provided.";
      }

      return {
        kind: "VarDeclaration",
        identifier,
        constant: false,
      } as VarDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected equals token following identifier in var declaration."
    );

    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
      constant: isConstant,
    } as VarDeclaration;

    this.expect(
      TokenType.Semicolon,
      "Variable declaration statment must end with semicolon."
    )
    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr();

    if (this.at().type == TokenType.Equals) {
      this.eat(); // advance past equals
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }

    return left;
  }

  private parse_object_expr(): Expr {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parse_additive_expr();
    }

    this.eat(); // advance past open brace.
    const properties = new Array<Property>();

    while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
      const key = this.expect(
        TokenType.Identifier,
        "Object literal key expected"
      ).value;

      if (this.at().type == TokenType.Comma) {
        this.eat();
        properties.push({ key, kind: "Property" } as Property);
        continue;
      }
      else if (this.at().type == TokenType.CloseBrace) {
        properties.push({ key, kind: "Property" });
        continue;
      }

      this.expect(
        TokenType.Colon,
        "Missing colon following identifier in Object"
      );
      const value = this.parse_expr();

      properties.push({ kind: "Property", value, key });
      if (this.at().type != TokenType.CloseBrace) {
        this.expect(
          TokenType.Comma,
          "Expected comma or closing bracket following property"
        );
      }
    }

    this.expect(TokenType.CloseBrace, "Object literal missing closing brace.");
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicitave_expr();

    while (["+", "-", "==", "!=", "<", ">"].includes(this.at().value)) {
      const operator = this.eat().value;
      const right = this.parse_multiplicitave_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_multiplicitave_expr(): Expr {
    let left = this.parse_call_member_expr();

    while (
      this.at().value == "/" ||
      this.at().value == "*" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_call_member_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_call_member_expr(): Expr {
    const member = this.parse_member_expr();

    if (this.at().type == TokenType.OpenParen) {
      return this.parse_call_expr(member);
    }

    return member;
  }

  private parse_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args(),
    } as CallExpr;

    if (this.at().type == TokenType.OpenParen) {
      call_expr = this.parse_call_expr(call_expr);
    }

    return call_expr;
  }

  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, "Expected open parenthesis");
    const args =
      this.at().type == TokenType.CloseParen ? [] : this.parse_arguments_list();

    this.expect(
      TokenType.CloseParen,
      "Missing closing parenthesis inside arguments list"
    );
    return args;
  }

  private parse_arguments_list(): Expr[] {
    const args = [this.parse_assignment_expr()];

    while (this.at().type == TokenType.Comma && this.eat()) {
      args.push(this.parse_assignment_expr());
    }

    return args;
  }

  private parse_member_expr(): Expr {
    let object = this.parse_primary_expr();

    while (
      this.at().type == TokenType.Dot ||
      this.at().type == TokenType.OpenBracket
    ) {
      const operator = this.eat();
      let property: Expr;
      let computed: boolean;

      if (operator.type == TokenType.Dot) {
        computed = false;
        property = this.parse_primary_expr();

        if (property.kind != "Identifier") {
          throw `Cannot use dot operator without right hand side being a identifier`;
        }
      } else {
        computed = true;
        property = this.parse_expr();
        this.expect(
          TokenType.CloseBracket,
          "Missing closing bracket in computed value."
        );
      }

      object = {
        kind: "MemberExpr",
        object,
        property,
        computed,
      } as MemberExpr;
    }

    return object;
  }

  private parse_codeblock_stmt(): Stmt[] {
    this.expect(TokenType.OpenBrace, "Expect \{ while parsing code block");

    const body: Stmt[] = [];

    while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
      const stmt = this.parse_stmt();
      body.push(stmt);
    }

    this.expect(TokenType.CloseBrace, "Expected \} while parsing code block");
    return body;
  }

  private parse_if_statement(): Stmt {
    this.eat(); //shitfing if key
    this.expect(TokenType.OpenParen, "Expected \( while parsing if statement.");

    const test = this.parse_expr();

    this.expect(TokenType.CloseParen, "Expect \) while parsing if statement.");

    const body = this.parse_codeblock_stmt();

    let alt: Stmt[] = [];

    if (this.at().type == TokenType.Else) {
      this.eat(); // shift else key

      if (this.at().type == TokenType.If) {
        alt = [this.parse_if_statement()];
      } else {
        alt = this.parse_codeblock_stmt();
      }
    }

    return {
      kind: "IfStmt",
      body: body,
      test: test,
      alt: alt
    } as IfStmt;
  }

  private parse_for_statement() {
    this.eat()  // eat for key
    this.expect(TokenType.OpenParen, "Expected \( while parsing for statement.")
    const init = this.parse_var_declaration();
    const test = this.parse_expr();

    this.expect(TokenType.Semicolon, "Semicolon \";\" expected following \"test expression\" in \"for\" statement.");

    const upd = this.parse_expr();

    this.expect(TokenType.CloseParen, "Expected \) to close \(.")

    const body = this.parse_codeblock_stmt();

    return {
      kind: "ForStmt",
      init: init,
      test: test,
      upd: upd,
      body: body,
    } as ForStmt
  }

  private parse_return_expr() {
    this.eat()

    return {
      kind: "ReturnExpr",
      toreturn: this.parse_expr()
    } as ReturnExpr;
  }

  // Parse Literal Values & Grouping Expressions
  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    // Determine which token we are currently at and return literal value
    switch (tk) {
      // User defined values.
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      // Constants and Numeric Constants
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      // Grouping Expressions (2 + 2) like
      case TokenType.OpenParen: {
        this.eat(); // eat the opening parenthesis
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesis expression. Expected )."
        ); // closing parenthesis
        return value;
      }
      case TokenType.String: {
        return {
          kind: "StringLiteral",
          value: this.eat().value
        } as StringLiteral;
      }
      case TokenType.Fn:
        return this.parse_fn_declaration();
      case TokenType.Return:
        return this.parse_return_expr();
      // undenfined tokens
      default:
        console.error("Unexpected token found during parsing!", this.at().value);
        process.exit(1);
    }
  }
}
