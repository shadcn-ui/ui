# Agent integrations for the shadcn/ui skill

This directory ships per-agent entry points for the shadcn/ui skill. Each
file loads the same underlying context (`../SKILL.md`, `../rules/*.md`,
`../cli.md`, `../mcp.md`) — only the frontmatter and format differ so the
file speaks its host agent's dialect.

## Install matrix

Copy the file from this directory into the shown location in **your
project root** (the folder inside each agent's subdirectory already
mirrors the target path, so `cp -R claude/. <your-project>/` works).

> **Note on the name:** the command is `/shadcn-ui`, not `/shadcn`.
> The bare `shadcn` name is reserved by the auto-invocable shadcn skill
> (`skills/shadcn/SKILL.md`, `user-invocable: false`), and using it as a
> slash command collides with the skill router on Claude Code and Codex
> CLI. `shadcn-ui` matches the package name and is unambiguous
> everywhere.

| Agent                    | File in this repo                                   | Copy to (in your project)              | Invoke as        |
| ------------------------ | --------------------------------------------------- | -------------------------------------- | ---------------- |
| Claude Code              | `claude/.claude/commands/shadcn-ui.md`              | `.claude/commands/shadcn-ui.md`        | `/shadcn-ui`     |
| Cursor                   | `cursor/.cursor/commands/shadcn-ui.md`              | `.cursor/commands/shadcn-ui.md`        | `/shadcn-ui`     |
| Windsurf                 | `windsurf/.windsurf/workflows/shadcn-ui.md`         | `.windsurf/workflows/shadcn-ui.md`     | `/shadcn-ui`     |
| Cline                    | `cline/.clinerules/workflows/shadcn-ui.md`          | `.clinerules/workflows/shadcn-ui.md`   | `/shadcn-ui.md`  |
| Continue.dev             | `continue/.continue/prompts/shadcn-ui.prompt`       | `.continue/prompts/shadcn-ui.prompt`   | `/shadcn-ui`     |
| GitHub Copilot (VS Code) | `copilot/.github/prompts/shadcn-ui.prompt.md`       | `.github/prompts/shadcn-ui.prompt.md`  | `/shadcn-ui`     |
| Gemini CLI               | `gemini/.gemini/commands/shadcn-ui.toml`            | `.gemini/commands/shadcn-ui.toml`      | `/shadcn-ui`     |
| OpenCode                 | `opencode/.opencode/command/shadcn-ui.md`           | `.opencode/command/shadcn-ui.md`       | `/shadcn-ui`     |

## Special cases

Not every agent supports project-local slash commands. These three are
best-effort equivalents:

- **Codex CLI** — Custom prompts are user-scoped only. Copy
  `codex/prompts/shadcn-ui.md` to `~/.codex/prompts/shadcn-ui.md`
  (globally available across all your Codex sessions). Invoke as
  `/shadcn-ui`.
- **Aider** — No slash-command extension surface. Copy
  `aider/CONVENTIONS.md` into your project root and load it per session
  with `aider --read CONVENTIONS.md` (or add `read: CONVENTIONS.md` to
  `.aider.conf.yml`).
- **Zed** — No project-local slash commands without a Rust/WASM
  extension. Copy `zed/prompts/shadcn-ui.md` into Zed's Prompt Library
  via the UI (`assistant: prompt library` action), then invoke with
  `/prompt shadcn-ui`.

## Why one file per agent

Each agent has its own frontmatter shape (Claude uses
`description`/`allowed-tools`, Windsurf uses `auto_execute_steps`,
Copilot uses `mode`/`tools`, Gemini uses TOML, etc.). A single
"one file fits all" wouldn't parse correctly for most of them.

All the bodies are near-identical — they delegate to
`skills/shadcn/SKILL.md` and the `rules/` files rather than duplicating
content, so updates to the skill flow through automatically.

## Related

- The OpenAI-hosted skill interface config lives at `openai.yml` in this
  directory.
- The shadcn MCP server has its own installation flow — see
  `../mcp.md` and the `shadcn mcp init --client <agent>` command in the
  main shadcn CLI.
