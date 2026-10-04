/**
 * @module remotion/hype30/beats
 * 30.0s hype clock. 120 BPM, so a beat is 15 frames and a bar is 60.
 * Captions are 2–5 words and hold at least 2 seconds.
 * Depends on: beats.
 * Used by: Hype30 film, tests, the SRT writer.
 */

import { FPS, framesToTimestamp } from "../beats";

export const HYPE_FPS = FPS;
export const HYPE_DURATION_FRAMES = 900;
/** One beat at 120 BPM. */
export const HYPE_BEAT_FRAMES = 15;

export interface IHypeBeat {
    readonly caption: string;
    readonly durationInFrames: number;
    readonly from: number;
    readonly id: string;
}

export const HYPE_BEATS: readonly IHypeBeat[] = [
    { caption: "Rent is late", durationInFrames: 60, from: 0, id: "late" },
    { caption: "Mia calls John", durationInFrames: 60, from: 60, id: "call" },
    { caption: "Tap repair Thursday", durationInFrames: 60, from: 120, id: "repair" },
    { caption: "October's $2,400 unpaid", durationInFrames: 60, from: 180, id: "october" },
    { caption: "August and September late", durationInFrames: 60, from: 240, id: "ledger" },
    { caption: "Hours got cut", durationInFrames: 60, from: 300, id: "hours" },
    { caption: "Hardship flagged", durationInFrames: 60, from: 360, id: "hardship" },
    { caption: "Rent help texted", durationInFrames: 60, from: 420, id: "sms" },
    { caption: "$1,200 today", durationInFrames: 60, from: 480, id: "today" },
    { caption: "$1,200 by the 18th", durationInFrames: 60, from: 540, id: "eighteenth" },
    { caption: "$1,200 received", durationInFrames: 60, from: 600, id: "received" },
    { caption: "Rent recovered", durationInFrames: 120, from: 660, id: "home" },
    { caption: "From overdue to paid.", durationInFrames: 120, from: 780, id: "brand" },
];

export const DEMO_TAG = "Demo data";

export function captionWords(caption: string): string[] {
    return caption.trim().split(/\s+/).filter((word) => word.length > 0);
}

export function hypeToSrt(): string {
    return HYPE_BEATS.map((beat, index) => {
        const start = framesToTimestamp(beat.from);
        const end = framesToTimestamp(beat.from + beat.durationInFrames);
        return `${index + 1}\n${start} --> ${end}\n${beat.caption}\n`;
    }).join("\n");
}

export function hypeBeatTable(): string {
    const lines = [
        "| In | Out | Caption | Frames |",
        "| --- | --- | --- | --- |",
    ];
    for (const beat of HYPE_BEATS) {
        const start = (beat.from / HYPE_FPS).toFixed(1);
        const end = ((beat.from + beat.durationInFrames) / HYPE_FPS).toFixed(1);
        lines.push(`| ${start}s | ${end}s | ${beat.caption} | ${beat.from}–${beat.from + beat.durationInFrames} |`);
    }
    return lines.join("\n");
}
