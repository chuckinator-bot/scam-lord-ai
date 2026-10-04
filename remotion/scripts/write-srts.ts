/**
 * Writes one .srt per film from the beat clock.
 * Run: node --experimental-strip-types scripts/write-srts.ts /opt/cursor/artifacts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO, DEMO30, filmToSrt, INTRO, TEASER } from "../src/beats.ts";

const directory = process.argv[2] ?? "/opt/cursor/artifacts";
const captions = join(dirname(fileURLToPath(import.meta.url)), "../captions");
mkdirSync(directory, { recursive: true });
mkdirSync(captions, { recursive: true });

const files: ReadonlyArray<readonly [string, string]> = [
    ["RentRecoveryIntro.srt", filmToSrt(INTRO)],
    ["RentRecoveryDemo.srt", filmToSrt(DEMO)],
    ["RentRecoveryTeaser.srt", filmToSrt(TEASER)],
    ["RentRecoveryDemo30.srt", filmToSrt(DEMO30)],
];

for (const [name, body] of files) {
    writeFileSync(join(directory, name), body);
    writeFileSync(join(captions, name), body);
}

console.log(`Wrote captions to ${directory}`);
