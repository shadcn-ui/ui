#!/usr/bin/env bash
# =============================================================================
# scripts/sync-upstream.sh — Merge upstream shadcn-ui/ui into Force UI
#
# Usage:
#   ./scripts/sync-upstream.sh           # full merge workflow
#   ./scripts/sync-upstream.sh --dry-run # preview what would happen, no changes
#
# Requirements: git, pnpm
# =============================================================================
set -euo pipefail

UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="main"
OUR_MAIN="main"
TRACKING_BRANCH="sync/upstream-main"
DRY_RUN=false

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[sync]${RESET} $*"; }
success() { echo -e "${GREEN}[sync]${RESET} $*"; }
warn()    { echo -e "${YELLOW}[sync]${RESET} $*"; }
error()   { echo -e "${RED}[sync]${RESET} $*" >&2; exit 1; }
header()  { echo -e "\n${BOLD}══════════════════════════════════════${RESET}"; \
            echo -e "${BOLD}  $*${RESET}"; \
            echo -e "${BOLD}══════════════════════════════════════${RESET}"; }

# ── Args ──────────────────────────────────────────────────────────────────────
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    *) error "Unknown argument: $arg. Usage: $0 [--dry-run]" ;;
  esac
done

# ── Preflight ─────────────────────────────────────────────────────────────────
header "Preflight checks"

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "$OUR_MAIN" ]]; then
  warn "You are on '$CURRENT_BRANCH', not '$OUR_MAIN'."
  read -rp "Switch to $OUR_MAIN? [y/N] " SWITCH
  [[ "$SWITCH" =~ ^[Yy]$ ]] || error "Aborted. Switch to $OUR_MAIN first."
  git checkout "$OUR_MAIN"
fi

if [[ -n "$(git status --porcelain)" ]]; then
  error "Working tree is dirty. Commit or stash your changes first."
fi

# Register merge=ours driver (idempotent, required for .gitattributes to work).
git config merge.ours.driver true
info "merge.ours.driver registered for this clone."

# ── Fetch upstream ────────────────────────────────────────────────────────────
header "Fetching upstream"

UPSTREAM_REF="$UPSTREAM_REMOTE/$UPSTREAM_BRANCH"

if [[ "$DRY_RUN" == "true" ]]; then
  info "[DRY RUN] Would run: git fetch $UPSTREAM_REMOTE"
  info "[DRY RUN] Using cached $UPSTREAM_REF"
else
  git fetch "$UPSTREAM_REMOTE" --no-tags
  success "Fetched $UPSTREAM_REMOTE"
fi

AHEAD_COUNT="$(git rev-list --count "$OUR_MAIN".."$UPSTREAM_REF")"
BEHIND_COUNT="$(git rev-list --count "$UPSTREAM_REF".."$OUR_MAIN")"

info "Upstream is ${BOLD}$AHEAD_COUNT commits ahead${RESET} of our $OUR_MAIN."
info "Our $OUR_MAIN is ${BOLD}$BEHIND_COUNT commits ahead${RESET} of upstream."

if [[ "$AHEAD_COUNT" -eq 0 ]]; then
  success "Already up to date with $UPSTREAM_REF. Nothing to do."
  exit 0
fi

if [[ "$DRY_RUN" == "true" ]]; then
  echo ""
  info "Upstream commits that would be merged (first 20):"
  git log --oneline "$OUR_MAIN".."$UPSTREAM_REF" | head -20
  echo ""
  info "Files most likely to need manual attention (mixed [FORCE-UI] content):"
  echo "  apps/v4/app/globals.css"
  echo "  apps/v4/registry/themes.ts"
  echo "  apps/v4/registry/styles.tsx"
  echo "  apps/v4/registry/bases.ts"
  echo "  apps/v4/registry/config.ts"
  echo ""
  info "[DRY RUN] No changes made. Remove --dry-run to proceed."
  exit 0
fi

# ── Update sync/upstream-main ─────────────────────────────────────────────────
header "Updating $TRACKING_BRANCH"

git checkout "$TRACKING_BRANCH" 2>/dev/null || git checkout -b "$TRACKING_BRANCH" "$UPSTREAM_REF"
git reset --hard "$UPSTREAM_REF"
git checkout "$OUR_MAIN"
success "$TRACKING_BRANCH → $(git rev-parse --short $UPSTREAM_REF)"

# ── Create merge branch ───────────────────────────────────────────────────────
MERGE_BRANCH="chore/sync-upstream-$(date +%Y-%m-%d)"
header "Creating merge branch: $MERGE_BRANCH"

if git show-ref --verify --quiet "refs/heads/$MERGE_BRANCH"; then
  warn "Branch $MERGE_BRANCH already exists."
  read -rp "Delete and recreate? [y/N] " RECREATE
  [[ "$RECREATE" =~ ^[Yy]$ ]] || error "Aborted."
  git branch -D "$MERGE_BRANCH"
fi

git checkout -b "$MERGE_BRANCH"

# ── Merge ─────────────────────────────────────────────────────────────────────
header "Merging $UPSTREAM_REF ($AHEAD_COUNT commits)"

MERGE_MSG="chore: merge upstream shadcn-ui/ui $(git rev-parse --short $UPSTREAM_REF)

Upstream commits merged: $AHEAD_COUNT
Upstream ref: $(git rev-parse $UPSTREAM_REF)
Merge date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

set +e
git merge --no-ff -m "$MERGE_MSG" "$UPSTREAM_REF"
MERGE_EXIT=$?
set -e

# ── Conflict handling ─────────────────────────────────────────────────────────
if [[ "$MERGE_EXIT" -ne 0 ]]; then
  header "Conflicts detected — manual resolution required"

  CONFLICTED="$(git diff --name-only --diff-filter=U)"

  warn "Conflicted files:"
  echo "$CONFLICTED" | sed 's/^/  /'

  echo ""
  info "[FORCE-UI] markers in conflicted files:"
  echo "$CONFLICTED" | while read -r f; do
    if grep -qE "\[FORCE-UI" "$f" 2>/dev/null; then
      warn "  $f"
      grep -n "\[FORCE-UI" "$f" | head -10 | sed 's/^/    /'
    fi
  done

  cat <<'GUIDE'

  Resolution guide
  ────────────────
  For each conflicted file, keep upstream's structural changes and
  re-insert our [FORCE-UI] tagged lines verbatim.

  globals.css     Keep upstream @import/@theme blocks. Re-insert:
                  • /* [FORCE-UI] */ style-force-ui.css import
                  • /* [FORCE-UI] */ style-force-ui custom-variant
                  • /* [FORCE-UI-START] */ font block (Noto Sans)
                  • /* [FORCE-UI-START] */ custom token mappings
                  • /* [FORCE-UI-START] */ :root and .dark blocks

  themes.ts       Keep all upstream theme objects. Ensure:
                  • import { forceUITheme } from "@force-ui/theme" at top
                  • forceUITheme is first element of THEMES array

  styles.tsx      Keep any new upstream style entries. Ensure:
                  • [FORCE-UI-START] force-ui entry is present

  bases.ts        Keep REACT_BASES intact. Ensure:
                  • [FORCE-UI-START] vue/svelte/ember block after ...REACT_BASES

  config.ts       Keep new upstream utility functions. Ensure:
                  • DEFAULT_CONFIG.style = "force-ui"
                  • PRESETS contains only force-ui presets

  After resolving all files:
    git add <file> ...
    git merge --continue

  Then re-run this script (it will detect the completed merge).

GUIDE

  exit 1
fi

success "Merge completed."

# ── Post-merge ────────────────────────────────────────────────────────────────
header "Post-merge checklist"

echo ""
info "1/3 — Verifying [FORCE-UI] markers survived..."
MARKER_COUNT="$(grep -rln "\[FORCE-UI" apps/v4/ --include="*.ts" --include="*.tsx" --include="*.css" 2>/dev/null | wc -l | tr -d ' ')"
if [[ "$MARKER_COUNT" -gt 0 ]]; then
  success "Found [FORCE-UI] markers in $MARKER_COUNT files."
else
  warn "No [FORCE-UI] markers found — verify mixed files survived the merge."
fi

echo ""
info "2/3 — Rebuilding registry..."
pnpm --filter=v4 registry:build
success "Registry rebuilt."

echo ""
info "3/3 — Type check..."
pnpm --filter=v4 typecheck
success "Type check passed."

# ── Done ──────────────────────────────────────────────────────────────────────
header "Sync complete ✓"

cat <<EOF

  Branch '$MERGE_BRANCH' is ready for review.

  Next steps:
    1. Review:  git diff main...$MERGE_BRANCH
    2. Push:    git push origin $MERGE_BRANCH
    3. Open a PR: $MERGE_BRANCH → main
    4. After merging, delete this branch.

EOF
