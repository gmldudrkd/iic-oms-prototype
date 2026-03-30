/**
 * GitHub Pages build script
 * - Temporarily moves API routes out (not supported in static export)
 * - Runs the build with GITHUB_PAGES=true
 * - Restores API routes after build
 */
import { execSync } from "child_process";
import { renameSync, existsSync, writeFileSync } from "fs";
import { resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const apiDir = resolve(root, "src/app/api");
const apiBackup = resolve(root, "src/app/_api_backup");

function moveApi(from, to) {
  if (existsSync(from)) {
    renameSync(from, to);
  }
}

try {
  // 1. Move API routes out of the way
  moveApi(apiDir, apiBackup);

  // 2. Build with GitHub Pages config
  execSync("GITHUB_PAGES=true npx env-cmd -f .env.prototype next build", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });
  // 3. Add .nojekyll to prevent GitHub Pages from ignoring _next/ directory
  writeFileSync(resolve(root, "out/.nojekyll"), "");
} finally {
  // 4. Always restore API routes
  moveApi(apiBackup, apiDir);
}
