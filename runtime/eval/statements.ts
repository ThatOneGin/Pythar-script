import { ForStmt, FunctionDeclaration, IfStmt, Program, Stmt, VarDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL, FunctionValue, BooleanVal } from "../values.ts";
import { eval_assignment } from "./expressions.ts";

export function eval_program (program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

export function eval_var_declaration (
    declaration: VarDeclaration,
    env: Environment,
): RuntimeVal {
    const value = declaration.value
    ? evaluate(declaration.value, env)
    : MK_NULL();
    return env.declareVar(declaration.identifier, value, declaration.constant);
}

function eval_body(body: Stmt[], env: Environment, nEnv: boolean = false): RuntimeVal {
    let scp: Environment;

    if (nEnv) {
        scp = new Environment;
    } else {
        scp = env;
    }
    let result: RuntimeVal = MK_NULL()
    for (const stmt of body) {
        result = evaluate(stmt, scp);
    }

    return result;
}

export function eval_if_stmt (
    declaration: IfStmt,
    env: Environment
): RuntimeVal {
    const test = evaluate(declaration.test, env);

    if ((test as BooleanVal).value === true) {
        return eval_body(declaration.body, env);
    } else if (declaration.alt) {
        return eval_body(declaration.alt, env)
    } else {
        return MK_NULL();
    }
}

export function eval_function_declaration (
    declaration: FunctionDeclaration,
    env: Environment
): RuntimeVal {
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body,
    } as FunctionValue;

    return declaration.name == "<anonymous>" ? fn : env.declareVar(declaration.name, fn, true);
}

export function eval_for_statement (
    declaration: ForStmt,
    env: Environment,
): RuntimeVal {

    eval_var_declaration(declaration.init, env);

    const body = declaration.body;
    const upd = declaration.upd;

    let test = evaluate(declaration.test, env);

    if ((test as BooleanVal).value != true) return MK_NULL();

    do {
        eval_body(body, env, false);
        eval_assignment(upd, env);

        test = evaluate(declaration.test, env);
    } while ((test as BooleanVal).value == true);


    return MK_NULL();
}