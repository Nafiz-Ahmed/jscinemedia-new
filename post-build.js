const fs = require("fs");
const path = require("path");

const sourcePublic = path.join(__dirname, "public");
const targetPublic = path.join(__dirname, ".next", "standalone", "public");

const sourceStatic = path.join(__dirname, ".next", "static");
const targetStatic = path.join(
  __dirname,
  ".next",
  "standalone",
  ".next",
  "static"
);

const standalonePackageJsonPath = path.join(
  __dirname,
  ".next",
  "standalone",
  "package.json"
);

console.log("🏗️  Preparing standalone build...");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    entry.isDirectory()
      ? copyDir(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

try {
  // 1. Copy public folder
  console.log("📂 Copying public folder...");
  copyDir(sourcePublic, targetPublic);

  // 2. Copy .next/static folder
  console.log("⚡ Copying .next/static folder...");
  copyDir(sourceStatic, targetStatic);

  // 3. Fix package.json for cPanel (Inject "start" script)
  console.log("🔧 Updating package.json for cPanel...");
  if (fs.existsSync(standalonePackageJsonPath)) {
    const packageJson = JSON.parse(
      fs.readFileSync(standalonePackageJsonPath, "utf8")
    );

    // Add the start script
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.start = "node server.js";

    fs.writeFileSync(
      standalonePackageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  }

  console.log("✅ Standalone build ready in ./.next/standalone");
} catch (err) {
  console.error("❌ Error copying files:", err);
  process.exit(1);
}
