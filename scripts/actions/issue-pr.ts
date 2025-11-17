import { PushCommit } from "@type-challenges/octokit-create-pull-request";

import { Action, Context, Github } from "./types";

export const getOthers = <A, B>(condition: boolean, a: A, b: B): A | B => (condition ? a : b);

const action: Action = async (github, context, core) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const payload = context.payload || {};
  const issue = payload.issue;
  const no = context.issue.number;

  if (!issue) return;

  const labels: string[] = (issue.labels || []).map((i: any) => i && i.name).filter(Boolean);

  // add to registry directory
  if (isRegistryDirectoryIssue(labels)) {
    const body = normalizeBody(issue.body || "");

    let registryIssue: RegistryIssue;

    try {
      registryIssue = parseRegistryIssue(body);
      registryIssue.logo = await resolveLogoContent(registryIssue.logo, core);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      core.error(`Failed to parse registry issue: ${message}`);
      await updateComment(github, context, RegistryMessages.issue_invalid_reply);
      return;
    }

    const { data: user } = await github.rest.users.getByUsername({
      username: issue.user.login,
    });

    const registries = await readJsonFile<RegistriesMap>(github, owner, repo, REGISTRIES_JSON_PATH);
    const directory = await readJsonFile<RegistryDirectoryEntry[]>(github, owner, repo, REGISTRY_DIRECTORY_JSON_PATH);

    const registryAlreadyExists = registries.hasOwnProperty(registryIssue.name);

    registries[registryIssue.name] = registryIssue.url;
    const nextDirectory = updateRegistryDirectory(directory, registryIssue);

    const files: Record<string, string> = {
      [REGISTRIES_JSON_PATH]: `${JSON.stringify(registries, null, 2)}\n`,
      [REGISTRY_DIRECTORY_JSON_PATH]: `${JSON.stringify(nextDirectory, null, 2)}\n`,
    };

    const userEmail = `${user.id}+${user.login}@users.noreply.github.com`;
    const commitMessage = `${registryAlreadyExists ? "chore" : "feat"}(registry): ${registryAlreadyExists ? "update" : "add"} ${registryIssue.name}`;

    const { data: pulls } = await github.rest.pulls.list({
      owner,
      repo,
      state: "open",
    });

    const existing_pull = pulls.find((i) => i.user?.login === "github-actions[bot]" && i.title.startsWith(`#${no} `));

    await PushCommit(github as any, {
      owner,
      repo,
      base: "main",
      head: `pulls/${no}`,
      changes: {
        files,
        commit: commitMessage,
        author: {
          name: `${user.name || user.id || user.login}`,
          email: userEmail,
        },
      },
      fresh: !existing_pull,
    });

    const replyBody = (prNumber: number, status: "created" | "updated") => {
      const key: RegistryReplyKey = status === "created" ? "issue_created_reply" : "issue_updated_reply";
      return RegistryMessages[key].replace("{0}", prNumber.toString());
    };

    if (existing_pull) {
      await updateComment(github, context, replyBody(existing_pull.number, "updated"));
    } else {
      const { data: pr } = await github.rest.pulls.create({
        owner,
        repo,
        base: "main",
        head: `pulls/${no}`,
        title: `#${no} - ${registryIssue.name} registry directory update`,
        body: RegistryMessages.pr_body.replace(/{no}/g, no.toString()).replace(/{name}/g, registryIssue.name),
        labels: ["auto-generated", "registry", "directory"],
      });

      await github.rest.issues.addLabels({
        owner,
        repo,
        issue_number: pr.number,
        labels: ["auto-generated", "registry", "directory"],
      });

      await updateComment(github, context, replyBody(pr.number, "created"));
    }

    return;
  }

};


const REGISTRIES_JSON_PATH = "apps/v4/public/r/registries.json";
const REGISTRY_DIRECTORY_JSON_PATH = "apps/v4/registry/directory.json";

const RegistryMessages = {
  issue_created_reply: "Thanks! PR #{0} has been created to update the registry directory.",
  issue_updated_reply: "Thanks! PR #{0} has been updated with the latest registry directory changes.",
  issue_invalid_reply: "Failed to parse the issue. Please ensure all required fields are filled in.",
  pr_body:
    "This is an auto-generated PR that updates the registry directory for issue #{no}.\n\n" +
    "- Registry: {name}\n" +
    "- Source issue: #{no}",
} as const;

type RegistryReplyKey = keyof Pick<typeof RegistryMessages, "issue_created_reply" | "issue_updated_reply">;

type RegistriesMap = Record<string, string>;

type RegistryDirectoryEntry = {
  name: string;
  homepage: string;
  url: string;
  description: string;
  logo: string;
};

type RegistryIssue = {
  name: string;
  url: string;
  homepage: string;
  description: string;
  logo: string;
};

function isRegistryDirectoryIssue(labels: string[]) {
  return ["registry", "directory"].every((label) => labels.includes(label));
}

function normalizeBody(body: string) {
  return body.replace(/\r\n/g, "\n");
}

function parseRegistryIssue(body: string): RegistryIssue {
  const name = ensureField(extractSection(body, "Name"), "Name");
  const url = ensureField(extractSection(body, "URL"), "URL");
  const homepage = ensureField(extractSection(body, "Homepage"), "Homepage");
  const description = ensureField(extractSection(body, "Description"), "Description");
  const logoRaw = ensureField(extractSection(body, "Logo"), "Logo");

  const normalizedName = name.startsWith("@") ? name : `@${name}`;

  return {
    name: normalizedName,
    url: url.trim(),
    homepage: homepage.trim(),
    description: description.trim(),
    logo: normalizeLogoValue(logoRaw),
  };
}

function ensureField(value: string | null, field: string) {
  if (!value || !value.trim()) throw new Error(`Missing "${field}" in the issue body.`);
  return value.trim();
}

function extractSection(body: string, heading: string) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`###\\s+${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n###\\s+|\\n-\\s*\\[|$)`, "i");
  const match = body.match(regex);
  if (!match) return null;
  return match[1].trim();
}

function stripCodeFence(value: string) {
  const trimmed = value.trim();
  const codeFenceRegex = /^```[a-z0-9-]*\n([\s\S]*?)\n```$/i;
  const match = trimmed.match(codeFenceRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return trimmed;
}

function normalizeLogoValue(value: string) {
  const unwrapped = stripCodeFence(value);
  const markdownImageMatch = unwrapped.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (markdownImageMatch && markdownImageMatch[1]) {
    return markdownImageMatch[1].trim();
  }
  return unwrapped.trim();
}

async function resolveLogoContent(value: string, core: typeof import("@actions/core")): Promise<string> {
  const trimmed = value.trim();

  if (isProbablyUrl(trimmed)) {
    try {
      const fetchFn = ((globalThis as unknown as { fetch?: (input: any, init?: any) => Promise<any> }).fetch);

      if (!fetchFn) {
        throw new Error("Global fetch is not available in this runtime.");
      }

      const response = await fetchFn(trimmed);

      if (!response || typeof response.ok !== "boolean") {
        throw new Error("Unexpected response from fetch.");
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const headers = response.headers && typeof response.headers.get === "function" ? response.headers : null;
      const contentType = headers?.get("content-type") || "";
      if (!contentType.toLowerCase().includes("image/svg")) {
        throw new Error(`Expected SVG content but received "${contentType}"`);
      }

      if (typeof response.text !== "function") {
        throw new Error("Response.text() is not available.");
      }

      const svg = await response.text();
      return typeof svg === "string" ? svg.trim() : "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Unable to download logo SVG: ${message}`);
    }
  }

  return trimmed;
}

function isProbablyUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

async function readJsonFile<T>(github: Github, owner: string, repo: string, path: string): Promise<T> {
  const { data } = await github.rest.repos.getContent({ owner, repo, path });

  if (Array.isArray(data) || data.type !== "file" || !("content" in data)) {
    throw new Error(`Unable to read JSON content from ${path}`);
  }

  const decoded = Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf8");

  try {
    return JSON.parse(decoded) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${path}: ${(error as Error).message}`);
  }
}

function updateRegistryDirectory(directory: RegistryDirectoryEntry[], data: RegistryIssue) {
  const nextDirectory = [...directory];
  const entry: RegistryDirectoryEntry = {
    name: data.name,
    homepage: data.homepage,
    url: data.url,
    description: data.description,
    logo: data.logo,
  };

  const existingIndex = nextDirectory.findIndex((item) => item.name === data.name);

  if (existingIndex >= 0) {
    nextDirectory[existingIndex] = entry;
  } else {
    nextDirectory.push(entry);
  }

  return nextDirectory;
}

async function updateComment(github: Github, context: Context, body: string) {
  const { data: comments } = await github.rest.issues.listComments({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  const existing_comment = comments.find((i) => i.user?.login === "github-actions[bot]");

  if (existing_comment) {
    return await github.rest.issues.updateComment({
      comment_id: existing_comment.id,
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body,
    });
  } else {
    return await github.rest.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body,
    });
  }
}

export default action;

export { parseRegistryIssue };