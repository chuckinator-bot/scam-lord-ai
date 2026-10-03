/**
 * @module remotion/scripts/detect-submission-assets
 * Rewrites src/submission/asset-flags.ts from the files in public/submission.
 * Run from remotion/ before a render. The browser bundle must not import node:fs.
 */

import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "submission");

function present(name) {
    return existsSync(path.join(dir, name));
}

const sectionVo = [1, 2, 3, 4, 5, 6].map((index) => present(`vo-0${index}.wav`));
const flags = {
    hasCall: present("call.mp4"),
    hasCallAudio: present("call-audio.wav"),
    hasVo: present("vo.wav"),
    sectionVo,
};

const body = `/**
 * @module remotion/submission/asset-flags
 * Which drop-in files are on disk. scripts/detect-submission-assets.mjs
 * rewrites the booleans before a render. Defaults are the placeholder mix.
 * Depends on: none.
 * Used by: Film.
 */

export interface IAssetFlags {
    readonly hasCall: boolean;
    readonly hasCallAudio: boolean;
    readonly hasVo: boolean;
    readonly sectionVo: readonly boolean[];
}

export const ASSET_FLAGS: IAssetFlags = {
    hasCall: ${flags.hasCall},
    hasCallAudio: ${flags.hasCallAudio},
    hasVo: ${flags.hasVo},
    sectionVo: [${sectionVo.join(", ")}],
};
`;

writeFileSync(path.join(root, "src", "submission", "asset-flags.ts"), body);
console.log(JSON.stringify(flags));
