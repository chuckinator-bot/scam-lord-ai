/**
 * @module remotion/scripts/write-hype-srt
 * Writes the hype SRT and the beat table.
 * Run from remotion/: npx vite-node scripts/write-hype-srt.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hypeBeatTable, hypeToSrt } from "../src/hype30/beats.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const srt = hypeToSrt();
const table = hypeBeatTable();
const targets = [
    path.resolve(here, "../captions/RentRecoveryHype30.srt"),
    "/opt/cursor/artifacts/RentRecoveryHype30.srt",
];

for (const target of targets) {
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, srt);
    console.log(target);
}

const tablePath = "/opt/cursor/artifacts/RentRecoveryHype30-beats.md";
writeFileSync(tablePath, `${table}\n`);
console.log(tablePath);
