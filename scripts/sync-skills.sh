set -e
BASE=$(pwd)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)
CLONE_DIR="__skills__clone__"

if [ ! -d "$BASE/skills/shadcn" ]; then
  echo "skills/shadcn not found"
  exit 1
fi

cd "$BASE"
if [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "chore: update skills"
  git push origin main
fi

git clone --quiet --depth 1 git@github.com:shadcn/skills.git "$CLONE_DIR"
cd "$CLONE_DIR"
find . | grep -v ".git" | grep -v "^\.*$" | xargs rm -rf
cp -r "$BASE/skills/shadcn/." .

if [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "$COMMIT_MESSAGE"
  git push origin main
fi

cd "$BASE"
rm -rf "$CLONE_DIR"
