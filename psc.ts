// deno-lint-ignore-file
import process from "node:process";
import * as fs from "node:fs";
import Parser from "./frontend/parser.ts";
import Environment, { CreateGlobalENV } from "./runtime/environment.ts";
import { makereadable } from "./runtime/eval/convert.ts";
import { evaluate } from "./runtime/interpreter.ts";

async function run(filename: string) {
	const parser = new Parser();
	const env = CreateGlobalENV();

	const input = await fs.readFileSync(filename, "utf-8");
	const program = parser.produceAST(input);

	const result = evaluate(program, env);
	makereadable(result)
}

async function repl() {
	const parser = new Parser();
	const env = new Environment;

	console.log("Repl v0.1 PytharScript");

	while (true) {
		const inputs = prompt("> ");

		if (!inputs || inputs.includes("exit")) {
			process.exit(1);
		}

		const program = parser.produceAST(inputs);

		try {
			const result = makereadable(evaluate(program, env))
			console.log(result);
		} catch (err) {
			console.log(err);
		}

	}
}

async function compile(file: string) {
	const parser = new Parser();
	const input = await fs.readFileSync(file, "utf-8");
	const ast = parser.produceAST(input);
	console.log(ast)
}

run("main.psc")