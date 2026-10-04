/**
 * @module remotion/scripts/write-submission-srt
 * Writes the narration guide SRT from the caption module.
 * Run from remotion/: npx vite-node scripts/write-submission-srt.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { guideSrt } from "../src/submission/captions.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const targets = [
    path.resolve(here, "../captions/RentRecoverySubmission.srt"),
    "/opt/cursor/artifacts/RentRecoverySubmission.srt",
];

const body = guideSrt();
for (const target of targets) {
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, body);
    console.log(target);
}
