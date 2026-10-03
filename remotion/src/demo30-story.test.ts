/**
 * @module remotion/demo30-story.test
 * Benefit math and the AppFolio counters stay inside the demo roster.
 * Depends on: demo30-story, roster.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { VOICE_LINE_V7 } from "./beats";
import {
    ARRANGED_DOLLARS,
    BOOK_DOLLARS,
    bookPercent,
    COLLECTED_DOLLARS,
    DEMO30_TURNS,
    dollars,
    OPEN_DOLLARS,
    PAST_DUE_END,
    PORTFOLIO_COUNTS,
    ROI_LINE,
    SATISFACTION_FROM,
    SATISFACTION_TO,
    SCHEDULED_DOLLARS,
    SOURCE_NAME,
    SYNC_HEADLINE,
    UNTOUCHED_DOLLARS,
} from "./demo30-story";
import { TENANTS } from "./roster";

describe("demo30 story numbers", () => {
    it("builds the overdue book from the four tenants", () => {
        expect(TENANTS.map((tenant) => tenant.amount)).toEqual([
            "$2,400.00",
            "$960.00",
            "$1,800.00",
            "$2,400.00",
        ]);
        expect(BOOK_DOLLARS).toBe(7560);
        expect(COLLECTED_DOLLARS).toBe(800);
        expect(SCHEDULED_DOLLARS).toBe(1600);
        expect(OPEN_DOLLARS).toBe(6760);
        expect(ARRANGED_DOLLARS).toBe(2400);
        expect(UNTOUCHED_DOLLARS).toBe(5160);
        expect(PAST_DUE_END).toBe(5160);
        expect(ROI_LINE).toBe("$2,400 arranged · 1 call · 0 staff hours");
        expect(SATISFACTION_FROM).toBe(3.8);
        expect(SATISFACTION_TO).toBe(4.6);
        expect(dollars(BOOK_DOLLARS)).toBe("$7,560.00");
        expect(bookPercent(COLLECTED_DOLLARS)).toBe("10.6%");
        expect(bookPercent(SCHEDULED_DOLLARS)).toBe("21.2%");
        expect(bookPercent(ARRANGED_DOLLARS)).toBe("31.7%");
    });

    it("counts a four-tenant book and names AppFolio as text", () => {
        expect(PORTFOLIO_COUNTS).toEqual([
            ["Properties", 18],
            ["Units", 63],
            ["Leases", 61],
            ["Tenants", 72],
            ["Work Orders", 14],
        ]);
        expect(SYNC_HEADLINE).toBe("Syncing from your property management software");
        expect(SOURCE_NAME).toBe("AppFolio");
    });

    it("speaks the Sunset Properties line and holds the link", () => {
        expect(DEMO30_TURNS[0]?.text.startsWith(VOICE_LINE_V7)).toBe(true);
        expect(DEMO30_TURNS[0]?.text).not.toContain("an AI assistant");
        expect(DEMO30_TURNS[3]?.text).toBe("Send the link.");
        expect(DEMO30_TURNS[3]?.at).toBe(72);
    });
});
