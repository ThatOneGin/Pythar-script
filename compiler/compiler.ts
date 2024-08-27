/**
 * Here is the code generator, it translates pythar code into some Lua code.
 * the next process will be the writer.
 * 
 * fun fact: this is not a compiler. its just a transcriber that uses ast as base
 * to generate lua code.
 */

import { BinaryExpr, CallExpr, Expr, ForStmt, FunctionDeclaration, Identifier, IfStmt, ObjectLiteral, VarDeclaration } from "../frontend/ast.ts";
import { TokenType } from "../frontend/lexer.ts";
export function codegenerator(node: any): any {
    switch (node.kind) {
        case "VarDeclaration":
            return c_vardeclaration(node as VarDeclaration);
        case "BinaryExpr":
            return c_binaryexpr(node as BinaryExpr)
        case "Identifier":
            return node.symbol;
        case "StringLiteral":
            return '"' + node.value + '"';
        case "NumericLiteral":
            return node.value;
        case "FunctionDeclaration":
            return c_functiondeclaration(node as FunctionDeclaration);
        case "ObjectLiteral":
            return c_objectexpr(node as ObjectLiteral);
        case "ReturnExpr":
            return "return " + codegenerator(node.toreturn as Expr);
        case "ForStmt":
            return c_forstmt(node as ForStmt);
        case "CallExpr":
            return c_callexpr(node as CallExpr);
        case "Program":
            return node.body.map(codegenerator);
        case "IfStmt":
            return c_ifstmt(node as IfStmt);
        default:
            console.log(node)
            throw new TypeError(`Unrecognized type found. '${node.kind}'`);
    }
}

//translate var declaration to other code
function c_vardeclaration(node: VarDeclaration) {
    const identifier: string = node.identifier;
    const value: any = codegenerator(node.value);

    if (node.constant) {
        return identifier+"<const> = "+value //no semicolons...
    } else if (!node.constant && value !== undefined){
        return identifier+" = "+value //also no semicolons
    } else {
        return "local "+identifier //no semicolons because they are optional D:
    }
}

// translates binary expresssion like 2 + 2 - (2 * 5 / 2)
function c_binaryexpr(node: BinaryExpr) {
    const lhs: any = codegenerator(node.left);
    const rhs: any = codegenerator(node.right);

    return lhs + " " + node.operator + " " + rhs;
}

//handle objects and translate into table(s)
function c_objectexpr(node: ObjectLiteral) {
    let translated = ``
    for (const property of node.properties) {
        //handle property undefined being possibly undefined.

        if (property.value == undefined) return new Error(`Property ${property} is undefined`);
        translated += "\t"+property.key+" = "+property.value.value+`,\n`
    }
    return "{\n"+translated+"}"
}

function c_functiondeclaration(node: FunctionDeclaration) {
    let parameters = "";
    for (let i = 0; i < node.parameters.length; i++) {
        if (node.parameters[i+1] == undefined) {
            parameters += node.parameters[i];
        } else {
            parameters += node.parameters[i] + ", ";
        }
    }
    let body: any = "";

    for (let i = 0; i < node.body.length; i++) {
        body += "\t"+codegenerator(node.body[i])+"\n";
    }

    const name = node.name

    return `function ${name}(${parameters})\n${body}\nend`
}

function c_forstmt(node: ForStmt) {
    if (node.init.value === undefined) throw `Initial value of ${node.init} is undefined|NULL.`
    node.init.value.value += 1
    const init: any = codegenerator(node.init);
    const max: any = codegenerator(node.test.right);
    const upd: any = codegenerator(node.upd);
    let body = ""
    
    for (let i = 0; i < node.body.length; i++) {
        body += "\t"+codegenerator(node.body[i])+"\n";
    }

    return `for ${init}, ${max},${upd} do\n\t${body}\nend`
}

function c_callexpr(node: CallExpr) {
    let name = codegenerator(node.caller)
    let args = "";


    for (let i = 0; i < node.args.length; i++) {
        if (node.args[i+1] == undefined) {
            args += codegenerator(node.args[i]);
        } else {
            args += codegenerator(node.args[i]) + ", ";
        }
    }

    return `${name}(${args})`;
}

function c_ifstmt(node: IfStmt) {
    const test = codegenerator(node.test)
    let body = ""
    let alt = ""

    if (node.alt !== undefined) {
        for (let i = 0; i < node.alt.length; i++) {
            alt += "\t"+codegenerator(node.alt[i])+"\n";
        }
    }

    for (let i = 0; i < node.body.length; i++) {
        body += "\t"+codegenerator(node.body[i])+"\n";
    }

    if (alt.length > 0) {
        return `if ${test} then \n${body}else\n${alt}end`
    }

    return `if ${test} then ${body}end`
}

export default class writer {
    code: string[]
    constructor(_code_: string[]) {
        this.code = _code_;
    }

    public compile() {
        let file_content = ""

        for (const cd of this.code) {
            file_content += cd+"\n"
        }

        Deno.writeTextFile("a.lua", file_content);
    }
}