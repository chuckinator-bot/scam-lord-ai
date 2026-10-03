/**
 * @module remotion/hype30/beats.test
 * Locks the 30-second hype clock and the short captions.
 * Depends on: hype30/beats.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import {
    captionWords,
    HYPE_BEAT_FRAMES,
    HYPE_BEATS,
    HYPE_DURATION_FRAMES,
    hypeToSrt,
} from "./beats";

describe("hype clock", () => {
    it("is exactly 30 seconds and lands on the beat", () => {
        expect(HYPE_DURATION_FRAMES).toBe(900);
        expect(HYPE_BEATS[0]?.from).toBe(0);
        let cursor = 0;
        for (const beat of HYPE_BEATS) {
            expect(beat.from).toBe(cursor);
            expect(beat.from % HYPE_BEAT_FRAMES).toBe(0);
            expect(beat.durationInFrames % HYPE_BEAT_FRAMES).toBe(0);
            expect(beat.durationInFrames).toBeGreaterThanOrEqual(60);
            cursor += beat.durationInFrames;
        }
        expect(cursor).toBe(HYPE_DURATION_FRAMES);
        expect(HYPE_BEATS[HYPE_BEATS.length - 1]?.caption).toBe("From overdue to paid.");
    });

    it("keeps every caption between 2 and 5 words", () => {
        for (const beat of HYPE_BEATS) {
            const count = captionWords(beat.caption).length;
            expect(count).toBeGreaterThanOrEqual(2);
            expect(count).toBeLessThanOrEqual(5);
        }
    });

    it("tells the Mia and John story without forbidden wording", () => {
        const captions = HYPE_BEATS.map((beat) => beat.caption);
        expect(captions).toEqual([
            "Rent is late",
            "Mia calls John",
            "Tap repair Thursday",
            "October's $2,400 unpaid",
            "August and September late",
            "Hours got cut",
            "Hardship flagged",
            "Rent help texted",
            "$1,200 today",
            "$1,200 by the 18th",
            "$1,200 received",
            "Rent recovered",
            "From overdue to paid.",
        ]);
        const blob = `${captions.join(" ")}\n${hypeToSrt()}`;
        expect(blob.toLowerCase()).not.toContain("scam");
        expect(blob).not.toContain("invoice.overdue");
        expect(blob.toLowerCase()).not.toContain("assistant");
    });
});
