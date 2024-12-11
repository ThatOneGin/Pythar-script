// deno-lint-ignore-file
import { ArrayLiteral, AssignmentExpr, BinaryExpr, CallExpr, Identifier, MemberExpr, ObjectLiteral } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberVal, RuntimeVal, MK_NULL, ObjectVal, NativeFnValue, FunctionValue, ArrayVal, MK_NUMBER, MK_BOOL, BooleanVal, StringVal, NullVal } from "../values.ts";

export function eval_numeric_binary_expr(
  lhs: RuntimeVal,
  rhs: RuntimeVal,
  operator: string
): RuntimeVal {

  switch (operator) {
    case "==":
      return equals(lhs, rhs, true);
    case "!=":
      return equals(lhs, rhs, false);
    default:
      if (lhs.type != "number" || rhs.type != "number") return MK_BOOL(false);

      const nlhs = lhs as NumberVal;
      const nrhs = rhs as NumberVal;

      switch (operator) {
        case "+":
          return MK_NUMBER(nlhs.value + nrhs.value);
        case "-":
          return MK_NUMBER(nlhs.value - nrhs.value);
        case "*":
          return MK_NUMBER(nlhs.value * nrhs.value);
        case "/":
          return MK_NUMBER(nlhs.value / nrhs.value);
        case "%":
          return MK_NUMBER(nlhs.value % nrhs.value);
        case ">":
          return MK_BOOL(nlhs.value > nrhs.value);
        case "<":
          return MK_BOOL(nlhs.value < nrhs.value);
        default:
          throw "Unknown operator in operation.";
      }
  }
}

function equals(lhs: RuntimeVal, rhs: RuntimeVal, strict: boolean): RuntimeVal {
  const compare = strict ? (a: unknown, b: unknown) => a === b : (a: unknown, b: unknown) => a !== b;

  switch (lhs.type) {
    case 'boolean':
      return MK_BOOL(compare((lhs as BooleanVal).value, (rhs as BooleanVal).value));
    case 'number':
      return MK_BOOL(compare((lhs as NumberVal).value, (rhs as NumberVal).value));
    case 'string':
      return MK_BOOL(compare((lhs as StringVal).value, (rhs as StringVal).value));
    case 'function':
      return MK_BOOL(compare((lhs as FunctionValue).body, (rhs as FunctionValue).body));
    case 'native-fn':
      return MK_BOOL(compare((lhs as NativeFnValue).call, (rhs as NativeFnValue).call));
    case 'null':
      return MK_BOOL(compare((lhs as NullVal).value, (rhs as NullVal).value));
    case 'object':
      return MK_BOOL(compare((lhs as ObjectVal).properties, (rhs as ObjectVal).properties));
    default:
      throw `RunTime: Unhandled type in equals function: ${lhs.type}, ${rhs.type}`
  }
}

export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const lhs: RuntimeVal = evaluate(binop.left, env);
  const rhs: RuntimeVal = evaluate(binop.right, env);

  return eval_numeric_binary_expr(lhs, rhs, binop.operator);
}

export function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(ident.symbol);
  return val;
}

export function eval_assignment(node: AssignmentExpr, env: Environment) {
  if (node.assigne.kind !== "Identifier") {
    throw `Invalid LHS inside of expression ${JSON.stringify(node.assigne)}`;
  }

  const varname = (node.assigne as Identifier).symbol;
  return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr(
  obj: ObjectLiteral,
  env: Environment
): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;
  for (const { key, value } of obj.properties) {
    const runtimeVal =
      value == undefined ? env.lookupVar(key) : evaluate(value, env);

    object.properties.set(key, runtimeVal);
  }

  return object;
}

export function eval_array_expr(
  obj: ArrayLiteral,
  env: Environment
): RuntimeVal {
  const array = { type: "array", value: [] } as ArrayVal;
  for (const value of obj.value) {
    const runtimeval = evaluate(value, env);

    array.value.push(runtimeval);
  }
  return array;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
  const args = expr.args.map((arg) => evaluate(arg, env));
  const fn = evaluate(expr.caller, env);

  if (fn.type == "native-fn") {
    let result = (fn as NativeFnValue).call(args, env)
    return result;
  }

  if (fn.type == "function") {
    const fun = fn as FunctionValue;
    const scope = new Environment(fun.declarationEnv);

    for (let i = 0; i < fun.parameters.length; i++) {
      const varname = fun.parameters[i];
      scope.declareVar(varname, args[i], false);
    }

    let result: RuntimeVal = MK_NULL();
    // evaluating the function body
    for (const stmt of fun.body) {
      result = evaluate(stmt, scope);
    }
    return result;
  }
  throw "Cannot call a value that is not a function " + JSON.stringify(fn)
}

export function eval_member_expr(env: Environment, node?: AssignmentExpr, expr?: MemberExpr) {
  if (expr) return env.lookupobj(expr);
  if (node) return env.lookupobj(node.assigne as MemberExpr, evaluate(node.value, env));

  throw "Cannot evaluate a member expression as it doesn't have members"
}