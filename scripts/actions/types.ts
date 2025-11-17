
import type IO from "@actions/io";
import type Core from "@actions/core";
import type { context, getOctokit } from "@actions/github";

export type Context = typeof context;
export type Github = ReturnType<typeof getOctokit>;
export type Action = (github: Github, context: Context, core: typeof Core, io: typeof IO) => Promise<void>;
