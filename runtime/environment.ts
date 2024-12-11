// deno-lint-ignore-file
import { Identifier, MemberExpr } from "../frontend/ast.ts";
import {
  MK_BOOL,
  MK_NATIVE_FN,
  MK_NULL,
  MK_NUMBER,
  MK_OBJECT,
  NumberVal,
  ObjectVal,
  RuntimeVal,
} from "./values.ts";

export function CreateGlobalENV() {
  const env = new Environment();
  // Create Default Global Enviornment
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);
  env.declareVar(
    "println",
    MK_NATIVE_FN((args, scope) => {
      console.log(...args);
      return MK_NULL();
    }),
    true
  );
  env.declareVar("mathpi", MK_NUMBER(Math.PI), true)
  env.declareVar("matheuler", MK_NUMBER(Math.E), true)
  env.declareVar("mathsqrt", MK_NATIVE_FN((args) => {
    const arg = (args[0] as NumberVal).value;
    return MK_NUMBER(Math.sqrt(arg));
  }), true),
    env.declareVar("mathrandom", MK_NATIVE_FN((args) => {
      const arg1 = (args[0] as NumberVal).value;
      const arg2 = (args[1] as NumberVal).value;

      const min = Math.ceil(arg1);
      const max = Math.floor(arg2);
      return MK_NUMBER(Math.floor(Math.random() * (max - min + 1)) + min);
    }), true)



  function timeFunction(_args: RuntimeVal[], _env: Environment) {
    return MK_NUMBER(Date.now());
  }
  env.declareVar("time", MK_NATIVE_FN(timeFunction), true);

  return env;
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentENV?: Environment) {
    const global = parentENV ? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}. As it already is defined.`;
    }

    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);

    // Cannot assign to constant
    if (env.constants.has(varname)) {
      throw `Cannot reasign to variable ${varname} as it was declared constant.`;
    }

    env.variables.set(varname, value);
    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }

    if (this.parent == undefined) {
      throw `Cannot resolve '${varname}' as it does not exist.`;
    }

    return this.parent.resolve(varname);
  }

  public lookupobj(expr: MemberExpr, value?: RuntimeVal, property?: Identifier): RuntimeVal {
    let val;
    if (expr.object.kind === 'MemberExpr') {
      val = this.lookupobj(expr.object as MemberExpr, undefined, (expr.object as MemberExpr).property as Identifier);
    } else {
      const varname = (expr.object as Identifier).symbol;
      const env = this.resolve(varname);

      val = env.variables.get(varname);
    }

    switch (val?.type) {
      case "object": {
        const currentProp = (expr.property as Identifier).symbol;
        const prop = property ? property.symbol : currentProp;

        if (value) (val as ObjectVal).properties.set(prop, value);

        if (currentProp) val = ((val as ObjectVal).properties.get(currentProp) as ObjectVal);

        return val;
      }
      default:
        throw "Cannot lookup type: " + val?.type;
    }
  }
}