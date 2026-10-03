/**
 * @module remotion/beats.test
 * Timing contract for the three films.
 * Depends on: beats.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import {
    beatById,
    CALL_LINK_FRAME,
    CASEY_ENTER_FRAME,
    CASEY_SCORE_FRAMES,
    DEMO,
    DEMO30,
    DEMO30_CASEY_CAPTION_FRAME,
    DEMO30_CASEY_ENTER_FRAME,
    DEMO30_CASEY_SCORE_FRAMES,
    DEMO30_LINK_FRAME,
    FILMS,
    filmToSrt,
    FPS,
    HARDSHIP_CASEY_CAPTION_FRAME,
    INTRO,
    stillFrame,
    TEASER,
    VOICE_LINE,
    VOICE_LINE_V7,
} from "./beats";

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

    it("keeps the demo on the trimmed call clock", () => {
        expect(DEMO.durationInFrames).toBe(1761);
        expect(beatById(DEMO, "call").durationInFrames).toBe(270);
        expect(beatById(DEMO, "call").durationInFrames - CALL_LINK_FRAME).toBe(2 * FPS);
    });

    it("keeps the teaser near 750 frames", () => {
        expect(Math.abs(TEASER.durationInFrames - 750)).toBeLessThanOrEqual(60);
        expect(TEASER.durationInFrames).toBe(750);
    });

    it("keeps the 30 second demo on a 900 frame clock", () => {
        expect(DEMO30.durationInFrames).toBe(900);
        expect(DEMO30.beats.map((beat) => beat.id)).toEqual([
            "stakes",
            "wake",
            "close",
            "portfolio",
            "chain",
            "call",
            "hardship",
            "benefit",
            "lockup",
        ]);
        expect(beatById(DEMO30, "stakes").durationInFrames).toBe(60);
        expect(beatById(DEMO30, "wake").durationInFrames).toBe(72);
        expect(beatById(DEMO30, "close").durationInFrames).toBe(84);
        expect(beatById(DEMO30, "portfolio").from).toBe(216);
        assertOrder(DEMO30.beats);
        expect(beatById(DEMO30, "call").durationInFrames - DEMO30_LINK_FRAME).toBeGreaterThanOrEqual(2 * FPS);
        expect(DEMO30.beats.some((beat) => beat.id === "pay")).toBe(false);
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

    it("keeps the v6 intro clock on the demo and the teaser", () => {
        TEASER.beats.slice(0, INTRO.beats.length).forEach((beat, index) => {
            expect(beat).toEqual(DEMO.beats[index]);
        });
        expect(DEMO.beats[2]?.srt).toBe(VOICE_LINE);
        expect(INTRO.beats[2]?.srt).toBe(VOICE_LINE_V7);
        INTRO.beats.forEach((beat, index) => {
            expect(beat.from).toBe(DEMO.beats[index]?.from);
            expect(beat.durationInFrames).toBe(DEMO.beats[index]?.durationInFrames);
        });
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
        expect(beatById(DEMO, "hardship").cues).toEqual([
            { from: 0, text: "Every turn gets a hardship check." },
            {
                from: HARDSHIP_CASEY_CAPTION_FRAME,
                text: "Casey hits 0.82. A person takes it from here.",
            },
        ]);
        expect(beatById(DEMO, "pay").caption).toBe(
            "Link lands by text and email. Paid before the call ends.",
        );
        expect(beatById(DEMO, "lockup").caption).toBe("Built at the Supabase hackathon.");
        expect(beatById(TEASER, "chain").caption).toBe("The overdue invoice starts the call on its own.");
        expect(beatById(TEASER, "offer").caption).toBe(
            "$800.00 today, $1,600.00 on the 14th. Lawn mowed Saturday.",
        );
        expect(beatById(TEASER, "lockup").caption).toBe("Built at the Supabase hackathon.");
        expect(beatById(DEMO30, "portfolio").caption).toBe(
            "Syncs from AppFolio into Supabase. Each landlord sees only their rows.",
        );
        expect(beatById(DEMO30, "chain").caption).toBe("The overdue invoice starts the call on its own.");
        expect(beatById(DEMO30, "benefit").caption).toBe("Past due drops. Owners get paid.");
        expect(beatById(DEMO30, "benefit").caption?.split(/\s+/).length).toBeLessThanOrEqual(8);
        expect(beatById(DEMO30, "lockup").caption).toBe("Built at the Supabase hackathon.");
        expect(beatById(DEMO30, "hardship").cues).toEqual([
            { from: 0, text: "Every turn gets a hardship check." },
            {
                from: DEMO30_CASEY_CAPTION_FRAME,
                text: "Casey hits 0.82. A person takes it from here.",
            },
        ]);
    });

    it("keeps every caption on screen for at least two seconds", () => {
        for (const filmSpec of FILMS) {
            for (const beat of filmSpec.beats) {
                if (beat.cues && beat.cues.length > 0) {
                    for (let index = 0; index < beat.cues.length; index += 1) {
                        const start = beat.cues[index]?.from ?? 0;
                        const end = beat.cues[index + 1]?.from ?? beat.durationInFrames;
                        expect(end - start).toBeGreaterThanOrEqual(2 * FPS);
                    }
                } else if (beat.caption) {
                    expect(beat.durationInFrames).toBeGreaterThanOrEqual(2 * FPS);
                }
            }
        }
        for (const beat of DEMO30.beats) {
            expect(beat.durationInFrames).toBeGreaterThanOrEqual(2 * FPS);
            if (beat.cues) {
                for (let index = 0; index < beat.cues.length; index += 1) {
                    const start = beat.cues[index]?.from ?? 0;
                    const end = beat.cues[index + 1]?.from ?? beat.durationInFrames;
                    expect(end - start).toBeGreaterThanOrEqual(2 * FPS);
                }
            }
        }
    });

    it("shows Casey's hardship line only after her gauge settles", () => {
        expect(HARDSHIP_CASEY_CAPTION_FRAME).toBe(CASEY_ENTER_FRAME + CASEY_SCORE_FRAMES);
        const hardship = beatById(DEMO, "hardship");
        const caseyCue = hardship.cues?.[1];
        expect(caseyCue?.from).toBe(HARDSHIP_CASEY_CAPTION_FRAME);
        const johnStill = hardship.from + 90;
        const caseyStill = hardship.from + HARDSHIP_CASEY_CAPTION_FRAME + 72;
        expect(johnStill).toBeLessThan(hardship.from + HARDSHIP_CASEY_CAPTION_FRAME);
        expect(caseyStill).toBeGreaterThanOrEqual(hardship.from + HARDSHIP_CASEY_CAPTION_FRAME);
        expect(caseyStill).toBeLessThan(hardship.from + hardship.durationInFrames);
        expect(DEMO30_CASEY_CAPTION_FRAME).toBe(DEMO30_CASEY_ENTER_FRAME + DEMO30_CASEY_SCORE_FRAMES);
        const short = beatById(DEMO30, "hardship");
        expect(short.cues?.[1]?.from).toBe(DEMO30_CASEY_CAPTION_FRAME);
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
        expect(srt).toContain(VOICE_LINE_V7);
        expect(srt).not.toContain("an AI assistant");
        expect(srt).not.toContain("invoice.overdue");
        const demo = filmToSrt(DEMO);
        expect(demo).toContain(VOICE_LINE);
        expect(demo).not.toContain(VOICE_LINE_V7);
        const teaser = filmToSrt(TEASER);
        expect(teaser).toContain(VOICE_LINE);
        const demo30 = filmToSrt(DEMO30);
        expect(demo30).toContain(VOICE_LINE_V7);
        expect(demo30).not.toContain("invoice.overdue");
        expect(demo30).not.toContain("an AI assistant");
        expect(demo30).not.toContain("Link lands by text and email");
        expect(demo30.endsWith("Built at the Supabase hackathon.\n") || demo30.includes("Built at the Supabase hackathon.")).toBe(true);
        expect(demo).toContain("00:00:36,000 --> 00:00:41,600\nEvery turn gets a hardship check.");
        expect(demo).toContain("00:00:41,600 --> 00:00:46,000\nCasey hits 0.82. A person takes it from here.");
        expect(demo).toContain("00:00:53,700 --> 00:00:58,700\nBuilt at the Supabase hackathon.");
        expect(demo).not.toContain("00:01:18");
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
