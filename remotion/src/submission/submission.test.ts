/**
 * @module remotion/submission/submission.test
 * Locks the approved narration, the section clock, and the seed home figures.
 * Depends on: captions, home-data, narration, timing.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { GUIDE_CUES, guideSrt, localFrameAtPhrase, sectionOverage } from "./captions";
import {
    HOME_TILES,
    NEEDS_YOU,
    OPEN_CALL,
    PROMISED_DOLLARS,
    RECOVERED_DOLLARS,
    STILL_OVERDUE_DOLLARS,
} from "./home-data";
import {
    CALLOUT_FILINGS,
    CALLOUT_SATISFIED,
    CLOSE_TAGLINE,
    LIVE_CALL_SLATE,
    NARRATION,
    STAT_BEHIND,
    STAT_BURDEN,
    STAT_RENT,
} from "./narration";
import {
    LIVE_CALL_WINDOW,
    sectionById,
    sectionFrames,
    sectionSlate,
    SECTIONS,
    SUBMISSION_DURATION_FRAMES,
} from "./timing";

function words(text: string): string[] {
    return text.trim().split(/\s+/).filter((word) => word.length > 0);
}

describe("submission clock", () => {
    it("fills two minutes without a gap", () => {
        expect(SECTIONS[0]?.startSec).toBe(0);
        expect(SECTIONS[SECTIONS.length - 1]?.endSec).toBe(120);
        let cursor = 0;
        for (const section of SECTIONS) {
            expect(section.startSec).toBe(cursor);
            cursor = section.endSec;
        }
        const frames = SECTIONS.reduce((sum, section) => {
            return sum + sectionFrames(section).duration;
        }, 0);
        expect(frames).toBe(SUBMISSION_DURATION_FRAMES);
        expect(SUBMISSION_DURATION_FRAMES).toBe(3_600);
    });

    it("uses the approved in and out points", () => {
        expect(sectionFrames(sectionById("stats"))).toEqual({ duration: 480, from: 0 });
        expect(sectionFrames(sectionById("oldway"))).toEqual({ duration: 510, from: 480 });
        expect(sectionFrames(sectionById("ring"))).toEqual({ duration: 300, from: 990 });
        expect(sectionFrames(sectionById("livecall"))).toEqual({ duration: 1_290, from: 1_290 });
        expect(sectionFrames(sectionById("home"))).toEqual({ duration: 510, from: 2_580 });
        expect(sectionFrames(sectionById("close"))).toEqual({ duration: 510, from: 3_090 });
    });

    it("prints the ring slate and the live-call window", () => {
        expect(sectionSlate(sectionById("ring"))).toBe("3 · RING · 0:33–0:43");
        expect(LIVE_CALL_WINDOW).toBe("0:43–1:26 · 43s");
        expect(LIVE_CALL_SLATE).toBe("LIVE CALL FOOTAGE");
    });
});

describe("narration", () => {
    it("keeps the approved figures and no earlier ones", () => {
        expect(NARRATION.stats).toContain("772 billion");
        expect(NARRATION.close).toContain("64 billion");
        const all = Object.values(NARRATION).join(" ");
        expect(all).not.toContain("777");
        expect(all).not.toContain("65 billion");
        expect(STAT_RENT).toBe("$772B rent paid last year");
        expect(STAT_BEHIND).toBe("Nearly 1 in 4 fell behind at least once");
        expect(STAT_BURDEN).toBe("Half of renter households spend over 30% of income on housing");
        expect(CALLOUT_FILINGS).toBe("3.6M eviction filings a year");
        expect(CALLOUT_SATISFIED).toBe("Only 1 in 5 operators is very satisfied");
        expect(CLOSE_TAGLINE).toBe("$64B of rent comes due every month. Some of it just needs a phone call.");
        expect(CLOSE_TAGLINE).not.toContain("65");
        expect(STAT_RENT).not.toContain("777");
    });

    it("rebuilds each paragraph from the caption chunks", () => {
        for (const section of SECTIONS) {
            const paragraph = NARRATION[section.id];
            const chunks = GUIDE_CUES.filter((cue) => cue.sectionId === section.id);
            if (paragraph.length === 0) {
                expect(chunks.length).toBeGreaterThan(0);
                expect(chunks.every((cue) => cue.text.startsWith("[live call]"))).toBe(true);
                continue;
            }
            expect(chunks.map((cue) => cue.text).join(" ")).toBe(paragraph);
        }
    });

    it("keeps chunks readable, and RentRecovery on its own line", () => {
        const spoken = GUIDE_CUES.filter((cue) => cue.sectionId !== "livecall");
        const outliers = spoken.filter((cue) => {
            const count = words(cue.text).length;
            const readable = count >= 6 && count <= 12;
            return !readable && cue.text !== "RentRecovery.";
        });
        expect(outliers).toEqual([]);
        expect(spoken.some((cue) => cue.text === "RentRecovery.")).toBe(true);
        expect(sectionOverage()).toEqual([]);
    });

    it("lands pictures on the spoken phrase", () => {
        expect(localFrameAtPhrase("stats", "Nearly")).toBe(132);
        expect(localFrameAtPhrase("stats", "That's not bad")).toBe(240);
        expect(localFrameAtPhrase("oldway", "late fee")).toBe(84);
        expect(localFrameAtPhrase("oldway", "notice")).toBe(120);
        expect(localFrameAtPhrase("oldway", "3.6 million")).toBe(180);
        expect(localFrameAtPhrase("oldway", "Only")).toBe(372);
        expect(localFrameAtPhrase("ring", "Nobody")).toBe(120);
        expect(localFrameAtPhrase("home", "rent recovered")).toBe(96);
        expect(localFrameAtPhrase("home", "still overdue")).toBe(120);
        expect(localFrameAtPhrase("home", "promised on plans")).toBe(144);
        expect(localFrameAtPhrase("home", "how fast")).toBe(192);
        expect(localFrameAtPhrase("home", "A short list")).toBe(276);
        expect(localFrameAtPhrase("home", "Every call")).toBe(384);
        expect(localFrameAtPhrase("close", "64 billion")).toBe(288);
        expect(localFrameAtPhrase("close", "RentRecovery")).toBe(492);
    });

    it("writes those words into the SRT", () => {
        const srt = guideSrt();
        expect(srt).toContain("772 billion");
        expect(srt).toContain("64 billion");
        expect(srt).toContain("[live call] Mia: Hi, is this John? It's Mia from Sunset Properties.");
        expect(srt).not.toContain("777");
        expect(srt).not.toContain("65 billion");
    });
});

describe("home seed figures", () => {
    it("uses the portfolio sums and leaves time to first call blank", () => {
        expect(RECOVERED_DOLLARS).toBe(10_660);
        expect(STILL_OVERDUE_DOLLARS).toBe(13_740);
        expect(PROMISED_DOLLARS).toBe(9_110);
        expect(HOME_TILES.map((tile) => tile.value)).toEqual([
            "$10,660.00",
            "$13,740.00",
            "$9,110.00",
            "—",
        ]);
        expect(NEEDS_YOU.map((row) => row.tenant)).toEqual([
            "Drew Okonkwo",
            "Finley Grant",
            "Quinn Alvarez",
        ]);
        expect(OPEN_CALL.tenant).toBe("Casey Nguyen");
        expect(OPEN_CALL.line).toBe("I got hit with a short week at work. I can catch up.");
        expect(OPEN_CALL.step).toBe("Jev check");
    });
});
