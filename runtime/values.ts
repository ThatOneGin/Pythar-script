import Environment from "./environment.ts";
import { Stmt } from "../frontend/ast.ts";
export type ValueType =
	| "null"
	| "number"
	| "boolean"
	| "object"
	| "native-fn"
	| "string"
	| "array"
	| "function";

export interface RuntimeVal {
	type: ValueType;
}

export interface NullVal extends RuntimeVal {
	type: "null";
	value: null;
}

export function MK_NULL() {
	return { type: "null", value: null } as NullVal;
}

export interface BooleanVal extends RuntimeVal {
	type: "boolean";
	value: boolean;
}

export function MK_BOOL(b: boolean): BooleanVal {
	return { type: "boolean", value: b } as BooleanVal;
}

export interface NumberVal extends RuntimeVal {
	type: "number";
	value: number;
}

export interface StringVal extends RuntimeVal {
    type: "string";
    value: string;
}

export interface ArrayVal extends RuntimeVal {
	type: "array";
	value: RuntimeVal[]
}

export function MK_NUMBER(n = 0) {
	return { type: "number", value: n } as NumberVal;
}

export function MK_STRING(val: string): StringVal {
    return { type: "string", value: val } as StringVal;
}

export interface ObjectVal extends RuntimeVal {
	type: "object";
	properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

export interface NativeFnValue extends RuntimeVal {
	type: "native-fn";
	call: FunctionCall;
}
export function MK_NATIVE_FN(call: FunctionCall) {
	return { type: "native-fn", call } as NativeFnValue;
}

export function MK_ARRAY(arg: RuntimeVal[]): ArrayVal {
	return {type: "array", value: arg}
}

export function MK_OBJECT(obj: Map<string, RuntimeVal>): ObjectVal {
    return { type: "object", properties: obj } as ObjectVal;
}

export interface FunctionValue extends RuntimeVal {
	type: "function";
	name: string;
	parameters: string[];
	declarationEnv: Environment;
	body: Stmt[];
}