#!/usr/bin/env bash
# CGE — One-shot setup script.
# Run this from inside the cge-website/ folder on your Mac after Claude creates the files.
# It initializes git, commits everything, and pushes to your GitHub repo.

set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/roblouw2nd/cge.git}"

# Clean up any stuck .git folder from earlier attempts inside the cowork sandbox
if [ -d .git ] && ! git status >/dev/null 2>&1; then
  echo "→ Removing stale .git folder…"
  sudo rm -rf .git || rm -rf .git
fi

if [ ! -d .git ]; then
  echo "→ git init"
  git init -q
fi

git config user.email "rob@chiefgrowthengineer.com"
git config user.name  "Rob Louw"

git add -A
git commit -m "Initial CGE site — home, services, about, work, blog, contact + Afrihost deploy" || echo "  (nothing to commit)"
git branch -M main

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "→ Adding remote origin: $REPO_URL"
  git remote add origin "$REPO_URL"
else
  echo "→ remote origin already set: $(git remote get-url origin)"
fi

echo ""
echo "✓ Local repo ready."
echo ""
echo "Next:"
echo "  1. Make sure the GitHub repo exists at $REPO_URL (create it via the GitHub UI if not)."
echo "  2. Push:        git push -u origin main"
echo "  3. Add FTP secrets at https://github.com/roblouw2nd/cge/settings/secrets/actions:"
echo "     • FTP_SERVER   (e.g. ftp.chiefgrowthengineer.com)"
echo "     • FTP_USERNAME (from Afrihost cPanel)"
echo "     • FTP_PASSWORD"
echo "  4. The next push to main will deploy to Afrihost automatically."
