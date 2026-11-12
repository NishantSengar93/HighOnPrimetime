// Renders the review stills + rig test into ./out
// Usage: npm run sheets            (set REMOTION_BROWSER_EXECUTABLE to reuse a local Chrome)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

mkdirSync("out", { recursive: true });
const run = (args) => execFileSync("npx", ["remotion", ...args, "--log=error"], { stdio: "inherit" });

for (const id of ["ExpressionSheet", "PoseSheet", "NewsroomEmpty", "StudioPreview", "AnchorCutout"]) {
  console.log(`still  ${id}`);
  run(["still", id, `out/${id}.png`]);
}
console.log("video  RigTest");
run(["render", "RigTest", "out/rig-test.mp4"]);
console.log("Done → ./out");
