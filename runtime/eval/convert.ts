// deno-lint-ignore-file
import { RuntimeVal, StringVal, NumberVal, BooleanVal, NullVal, ObjectVal, FunctionValue, ArrayVal } from "../values.ts"
import { MK_ARRAY } from '../values.ts';

export function makereadable(arg: RuntimeVal) {
  switch (arg.type) {
    case "string":
      return (arg as StringVal).value;
    case "number":
      return (arg as NumberVal).value;
    case "boolean":
      return (arg as BooleanVal).value;
    case "null":
      return (arg as NullVal).value;
    case "object": {
      const obj: { [key: string]: unknown } = {};
      const aObj = arg as ObjectVal;
      aObj.properties.forEach((value: any, key: string | number) => obj[key] = makereadable(value));
      return obj;
    }
    case "array": {
      const arr: unknown[] = [];
      const aArr = arg as ArrayVal;
      aArr.value.forEach((value: any) => arr.push(makereadable(value)));
      return arr;
    }
    case 'function': {
      const fn = arg as FunctionValue;
      return fn.name == "<anonymous>" ? `[Function (anonymous)]` : `[Function: ${fn.name}]`;
    }
    case "native-fn": {
      return `[Native Function]`;
    }
    default:
      return arg;
  }
}

export function printValues(args: Array<RuntimeVal>) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    console.log(makereadable(arg));
  }
}