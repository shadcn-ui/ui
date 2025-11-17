import * as io from "@actions/io";
import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";

process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main(): Promise<void> {
  const token = process.argv[2];
  const fnName = process.argv[3];
  const github = getOctokit(token);

  const module = await import(`./${fnName}.ts`);
  if (typeof module.default !== "function") {
    throw new Error(`Action "${fnName}" does not export a default function.`);
  }

  await module.default(github, context, core, io);
}

function handleError(err: any): void {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
  process.exit(1);
}