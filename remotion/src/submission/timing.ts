/**
 * @module remotion/submission/timing
 * Section in and out for the two-minute submission. One config.
 * Chuck's recorded read replaces these targets. See remotion/SUBMISSION.md.
 * Depends on: beats.
 * Used by: captions, Film, tests.
 */

import { FPS } from "../beats";

export const SUBMISSION_FPS = FPS;
export const SUBMISSION_DURATION_FRAMES = 3_600;

export type TSectionId = "stats" | "oldway" | "ring" | "livecall" | "home" | "close";

export interface ISection {
    readonly endSec: number;
    readonly id: TSectionId;
    readonly index: number;
    readonly label: string;
    readonly startSec: number;
}

export const SECTIONS: readonly ISection[] = [
    { endSec: 16, id: "stats", index: 1, label: "STATS", startSec: 0 },
    { endSec: 33, id: "oldway", index: 2, label: "OLD WAY", startSec: 16 },
    { endSec: 43, id: "ring", index: 3, label: "RING", startSec: 33 },
    { endSec: 86, id: "livecall", index: 4, label: "LIVE CALL", startSec: 43 },
    { endSec: 103, id: "home", index: 5, label: "HOME", startSec: 86 },
    { endSec: 120, id: "close", index: 6, label: "CLOSE", startSec: 103 },
];

/**
 * Seconds to delay each per-section file (vo-01.wav … vo-06.wav)
 * after that section's start. Positive starts the file later.
 */
export const VO_OFFSETS_SEC: readonly number[] = [0, 0, 0, 0, 0, 0];

export function secToFrame(sec: number): number {
    return Math.round(sec * SUBMISSION_FPS);
}

export function sectionById(id: TSectionId): ISection {
    const section = SECTIONS.find((item) => item.id === id);
    if (!section) {
        throw new Error(`Missing section ${id}`);
    }
    return section;
}

export function sectionFrames(section: ISection): { duration: number; from: number } {
    const from = secToFrame(section.startSec);
    const end = secToFrame(section.endSec);
    return { duration: end - from, from };
}

/** m:ss from a whole number of seconds. */
export function formatClock(sec: number): string {
    const minutes = Math.floor(sec / 60);
    const seconds = sec - minutes * 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Guide slate, for example "3 · RING · 0:33–0:43". */
export function sectionSlate(section: ISection): string {
    const start = formatClock(section.startSec);
    const end = formatClock(section.endSec);
    return `${section.index} · ${section.label} · ${start}–${end}`;
}

const live = sectionById("livecall");
const liveSeconds = live.endSec - live.startSec;

/** Placeholder window. The footage slot follows this until a real file arrives. */
export const LIVE_CALL_WINDOW = `${formatClock(live.startSec)}–${formatClock(live.endSec)} · ${liveSeconds}s`;
