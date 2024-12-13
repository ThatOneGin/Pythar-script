/**
 * this project is mainly based on tylerlaceby guides series.
 * reference: https://github.com/tlaceby/guide-to-interpreters-series/tree/main
 */

import process from "node:process"

export enum TokenType {
  Number,
  Identifier,

  Let,
  Const,
  Fn,

  UnderLine,
  Exclamation,
  PlusPLus,
  MinusMinus,
  NotEqualsCompare,
  EqualsCompare,

  BinaryOperator,
  Equals,
  Comma,
  Dot,
  Colon,
  Semicolon,

  OpenParen,
  CloseParen,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,

  String,
  If,
  Else,
  For,

  Greater,
  Lesser,

  Return,

  EOF,
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
  fn: TokenType.Fn,
  if: TokenType.If,
  for: TokenType.For,
  else: TokenType.Else,
  return: TokenType.Return
};


export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return { value, type };
}

function isalpha(src: string, firstcharacter: boolean = false) {
  if (firstcharacter) {
    return /^[A-Za-z_]+$/.test(src);
  }

  return /^[A-Za-z0-9_]+$/.test(src);
}

function isskippable(str: string) {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

function isint(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

/**
 * process code into tokens that have a type and a value. 
 */
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("").reverse();

  while (src.length > 0) {

    if (src[src.length - 1] == "(") {
      tokens.push(token(src.pop(), TokenType.OpenParen));
    } else if (src[src.length - 1] == ")") {
      tokens.push(token(src.pop(), TokenType.CloseParen));
    } else if (src[src.length - 1] == "{") {
      tokens.push(token(src.pop(), TokenType.OpenBrace));
    } else if (src[src.length - 1] == "}") {
      tokens.push(token(src.pop(), TokenType.CloseBrace));
    } else if (src[src.length - 1] == "[") {
      tokens.push(token(src.pop(), TokenType.OpenBracket));
    } else if (src[src.length - 1] == "]") {
      tokens.push(token(src.pop(), TokenType.CloseBracket));
    } else if (src[src.length - 1] == "_") {
      tokens.push(token(src.pop(), TokenType.UnderLine));
    }
    else if (
      src[src.length - 1] == "*" ||
      src[src.length - 1] == "/" ||
      src[src.length - 1] == "%" ||
      src[src.length - 1] == ">" ||
      src[src.length - 1] == "<"
    ) {
      tokens.push(token(src.pop(), TokenType.BinaryOperator));
    } else if (src[src.length - 1] == "=") {
      src.pop();
      if (src[src.length - 1] == "=") {
        src.pop();
        tokens.push(token("==", TokenType.EqualsCompare));
      } else {
        tokens.push(token("=", TokenType.Equals));
      }
    } else if (src[src.length - 1] == "!") {
      src.pop();
      if (String(src[src.length - 1]) == "=") {
        src.pop();
        tokens.push(token("!=", TokenType.NotEqualsCompare));
      } else {
        tokens.push(token("!", TokenType.Exclamation));
      }
    } else if (src[src.length - 1] == ";") {
      tokens.push(token(src.pop(), TokenType.Semicolon));
    } else if (src[src.length - 1] == ":") {
      tokens.push(token(src.pop(), TokenType.Colon));
    } else if (src[src.length - 1] == "+") {
      src.pop();

      if (src[src.length - 1] == "+") {
        src.pop();
        tokens.push(token("++", TokenType.PlusPLus));
      } else {
        tokens.push(token("+", TokenType.BinaryOperator));
      }
    } else if (src[src.length - 1] == "-") {
      src.pop();

      if (src[src.length - 1] == "-") {
        src.pop();
        tokens.push(token("--", TokenType.MinusMinus));
      } else {
        tokens.push(token("-", TokenType.BinaryOperator));
      }
    } else if (src[src.length - 1] == ",") {
      tokens.push(token(src.pop(), TokenType.Comma));
    } else if (src[src.length - 1] == ".") {
      tokens.push(token(src.pop(), TokenType.Dot));
    } else if (src[src.length - 1] == '"') {
      let str = ""
      src.pop()

      while (src.length > 0) {
        const k = src.pop()

        if (k == '"') {
          break
        } else {
          str += k
        }
      }
      tokens.push(token(str, TokenType.String))
    } else {

      if (isint(src[src.length - 1])) {
        let num = "";
        while (src.length > 0 && isint(src[src.length - 1])) {
          num += src.pop();
        }

        tokens.push(token(num, TokenType.Number));
      } else if (isalpha(src[src.length - 1], true)) {
        let ident = "";
        ident += src.pop();

        while (src.length > 0 && isalpha(src[src.length - 1])) {
          ident += src.pop();
        }

        const reserved = KEYWORDS[ident];

        if (typeof reserved == "number") {
          tokens.push(token(ident, reserved));
        } else {
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else if (isskippable(src[src.length - 1])) {
        src.pop();
      } else {
        console.error(
          "Unreconized character found in source: ",
          src[src.length - 1].charCodeAt(0),
          src[src.length - 1]
        );
        process.exit(1);
      }
    }
  }
  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
  return tokens;
}
