/**
 * this project is mainly based on tylerlaceby guides series.
 * reference: https://github.com/tlaceby/guide-to-interpreters-series/tree/main
 * 
 * Here is the lexer, where the source code enters and outputs tokens
 * tokens structure is something like:
 * {
 *     type: TokenType,
 *     value: string
 * }
 * it serves for more secure and accurate ast production.
 * 
 * lexer -> parser -> codegenerator -> writer -> <output>
 * 
 * next process: parser.ts
 */

import process from "node:process"

export enum TokenType {
	Number,
	Identifier,

	Let,
	Const,
	Var,
	Fn,

	Mutable,
	Immutable,

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
	var: TokenType.Var,
	else: TokenType.Else,
	mut: TokenType.Mutable,
	immut: TokenType.Immutable,
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
	const src = sourceCode.split("");

	while (src.length > 0) {

		if (src[0] == "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		} else if (src[0] == "{") {
			tokens.push(token(src.shift(), TokenType.OpenBrace));
		} else if (src[0] == "}") {
			tokens.push(token(src.shift(), TokenType.CloseBrace));
		} else if (src[0] == "[") {
			tokens.push(token(src.shift(), TokenType.OpenBracket));
		} else if (src[0] == "]") {
			tokens.push(token(src.shift(), TokenType.CloseBracket));
		}	else if (src[0] == "_") {
			tokens.push(token(src.shift(), TokenType.UnderLine));
		}
		else if (
			src[0] == "*" ||
			src[0] == "/" ||
			src[0] == "%" ||
			src[0] == ">" ||
			src[0] == "<"
		) {	
			tokens.push(token(src.shift(), TokenType.BinaryOperator));
		} else if (src[0] == "=") {
			src.shift();
			if (src[0] == "=") {
				src.shift();
				tokens.push(token("==", TokenType.EqualsCompare));
			} else {
				tokens.push(token("=", TokenType.Equals));			
			}
		} else if (src[0] == "!") {
			src.shift();
			if (String(src[0]) == "=") {
				src.shift();
				tokens.push(token("!=", TokenType.NotEqualsCompare));
			} else {
				tokens.push(token("!", TokenType.Exclamation));
			}
		} else if (src[0] == ";") {
			tokens.push(token(src.shift(), TokenType.Semicolon));
		} else if (src[0] == ":") {
			tokens.push(token(src.shift(), TokenType.Colon));
		} else if (src[0] == "+") {
			src.shift();

			if (src[0] == "+") {
				src.shift();
				tokens.push(token("++", TokenType.PlusPLus));
			} else {
				tokens.push(token("+", TokenType.BinaryOperator));
			}
		} else if (src[0] == "-") {
			src.shift();

			if (src[0] == "-") {
				src.shift();
				tokens.push(token("--", TokenType.MinusMinus));
			} else {
				tokens.push(token("-", TokenType.BinaryOperator));
			}
		} else if (src[0] == ",") {
			tokens.push(token(src.shift(), TokenType.Comma));
		} else if (src[0] == ".") {
			tokens.push(token(src.shift(), TokenType.Dot));
		} else if (src[0] == '"') {
			let str = ""
			src.shift()

			while (src.length > 0) {
				const k = src.shift()

				if (k == '"') {
					break
				} else {
					str += k
				}
			} 
			tokens.push(token(str, TokenType.String))
		} else {

			if (isint(src[0])) {
				let num = "";
				while (src.length > 0 && isint(src[0])) {
					num += src.shift();
				}

				tokens.push(token(num, TokenType.Number));
			} else if (isalpha(src[0], true)) {
				let ident = "";
				ident += src.shift();

				while (src.length > 0 && isalpha(src[0])) {
					ident += src.shift();
				}

				const reserved = KEYWORDS[ident];

				if (typeof reserved == "number") {
					tokens.push(token(ident, reserved));
				} else {
					tokens.push(token(ident, TokenType.Identifier));
				}
			} else if (isskippable(src[0])) {
				src.shift();
			} else {
				console.error(
					"Unreconized character found in source: ",
					src[0].charCodeAt(0),
					src[0]
				);
				process.exit(1);
			}
		}
	}
	tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
	return tokens;
}