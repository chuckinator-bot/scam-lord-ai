/**
 * @module remotion/beats.test
 * Timing contract for the three films.
 * Depends on: beats.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { beatById, DEMO, FILMS, filmToSrt, FPS, INTRO, stillFrame, TEASER } from "./beats";

function assertOrder(beats: readonly { from: number; durationInFrames: number }[]) {
    expect(beats[0]?.from).toBe(0);
    for (let index = 1; index < beats.length; index += 1) {
        const previous = beats[index - 1];
        const current = beats[index];
        expect(current?.from).toBe((previous?.from ?? 0) + (previous?.durationInFrames ?? 0));
    }
}

describe("film durations", () => {
    it("keeps the intro near 330 frames", () => {
        expect(Math.abs(INTRO.durationInFrames - 330)).toBeLessThanOrEqual(60);
        expect(INTRO.durationInFrames).toBe(330);
    });

    it("keeps the demo between 60 and 65 seconds", () => {
        expect(DEMO.durationInFrames).toBeGreaterThanOrEqual(60 * FPS);
        expect(DEMO.durationInFrames).toBeLessThanOrEqual(65 * FPS);
        expect(DEMO.durationInFrames).toBe(1831);
    });

    it("keeps the teaser near 750 frames", () => {
        expect(Math.abs(TEASER.durationInFrames - 750)).toBeLessThanOrEqual(60);
        expect(TEASER.durationInFrames).toBe(750);
    });

    it("matches each film length to the sum of its beats", () => {
        for (const filmSpec of FILMS) {
            const sum = filmSpec.beats.reduce((total, beat) => total + beat.durationInFrames, 0);
            expect(sum).toBe(filmSpec.durationInFrames);
            const last = filmSpec.beats[filmSpec.beats.length - 1];
            expect((last?.from ?? 0) + (last?.durationInFrames ?? 0)).toBe(filmSpec.durationInFrames);
        }
    });
});

describe("beat order", () => {
    it("plays intro beats in script order", () => {
        expect(INTRO.beats.map((beat) => beat.id)).toEqual(["late", "chase", "wake", "split", "brand"]);
        assertOrder(INTRO.beats);
    });

    it("plays demo beats in script order, intro first", () => {
        expect(DEMO.beats.map((beat) => beat.id)).toEqual([
            "late",
            "chase",
            "wake",
            "split",
            "brand",
            "portfolio",
            "webhook",
            "call",
            "hardship",
            "pay",
            "lockup",
        ]);
        assertOrder(DEMO.beats);
    });

    it("plays teaser beats in script order, intro first", () => {
        expect(TEASER.beats.map((beat) => beat.id)).toEqual([
            "late",
            "chase",
            "wake",
            "split",
            "brand",
            "chain",
            "offer",
            "lockup",
        ]);
        assertOrder(TEASER.beats);
    });

    it("reuses the same intro frames in every film", () => {
        for (const filmSpec of [DEMO, TEASER]) {
            INTRO.beats.forEach((beat, index) => {
                expect(filmSpec.beats[index]).toEqual(beat);
            });
        }
    });
});

describe("captions", () => {
    it("uses the story captions verbatim", () => {
        expect(beatById(DEMO, "portfolio").caption).toBe(
            "Portfolio syncs to Supabase. Row-level security keeps each landlord in their own rows.",
        );
        expect(beatById(DEMO, "webhook").caption).toBe("The overdue invoice starts the call on its own.");
        expect(beatById(DEMO, "call").caption).toBe(
            "Tenant asks for 4 payments. Policy caps it at 2, and Claude counters inside that limit.",
        );
        expect(beatById(DEMO, "hardship").caption).toBe(
            "Hardship score hits 0.82. A person takes it from here.",
        );
        expect(beatById(DEMO, "pay").caption).toBe(
            "Link lands by text and email. Paid before the call ends.",
        );
        expect(beatById(DEMO, "lockup").caption).toBe("Built at the Supabase hackathon.");
        expect(beatById(TEASER, "chain").caption).toBe("The overdue invoice starts the call on its own.");
        expect(beatById(TEASER, "offer").caption).toBe(
            "$800.00 today, $1,600.00 on the 14th. Lawn mowed Saturday.",
        );
        expect(beatById(TEASER, "lockup").caption).toBe("Built at the Supabase hackathon.");
    });

    it("keeps every caption on screen for at least two seconds", () => {
        for (const filmSpec of FILMS) {
            for (const beat of filmSpec.beats) {
                if (beat.caption) {
                    expect(beat.durationInFrames).toBeGreaterThanOrEqual(2 * FPS);
                }
            }
        }
    });

    it("leaves the intro free of lower-third captions", () => {
        for (const beat of INTRO.beats) {
            expect(beat.caption).toBeNull();
        }
    });

    it("writes an srt timestamp from the frame clock", () => {
        const srt = filmToSrt(INTRO);
        expect(srt.startsWith("1\n00:00:00,000 --> 00:00:02,000\nRENT IS LATE.")).toBe(true);
        expect(srt).toContain("00:00:09,000 --> 00:00:11,000\nRentRecovery\nFrom overdue to paid.");
        expect(FPS).toBe(30);
    });

    it("picks a still inside each beat", () => {
        for (const filmSpec of FILMS) {
            for (const beat of filmSpec.beats) {
                const frame = stillFrame(beat);
                expect(frame).toBeGreaterThanOrEqual(beat.from);
                expect(frame).toBeLessThan(beat.from + beat.durationInFrames);
            }
        }
    });
});
