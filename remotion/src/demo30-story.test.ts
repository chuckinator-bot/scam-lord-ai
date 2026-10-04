/**
 * @module remotion/demo30-story.test
 * Benefit math and the AppFolio counters stay inside the demo roster.
 * Depends on: demo30-story, roster.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { DEMO30_FLAG_LINE, DEMO30_HARDSHIP_SCORE, VOICE_LINE_MIA } from "./beats";
import {
    ACTIVITY_EMPTY,
    ARRANGED_DOLLARS,
    ASSISTANCE_URL,
    ASSIST_LINE,
    BOOK_DOLLARS,
    bookPercent,
    CALL_LINES,
    COLLECTED_DOLLARS,
    DEMO30_DISPUTE,
    DEMO30_DISTRESSED,
    dollars,
    FUNNEL_AT_SYNC,
    HOME_TILES,
    JOHN_QUOTE,
    MIA_OPENER,
    NEEDS_YOU_HEADING,
    OFFER_LINES,
    OPEN_DOLLARS,
    PAST_DUE_END,
    PLAN_LINE,
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
        expect(COLLECTED_DOLLARS).toBe(1200);
        expect(SCHEDULED_DOLLARS).toBe(1200);
        expect(OPEN_DOLLARS).toBe(6360);
        expect(ARRANGED_DOLLARS).toBe(2400);
        expect(UNTOUCHED_DOLLARS).toBe(5160);
        expect(PAST_DUE_END).toBe(6360);
        expect(PLAN_LINE).toBe("$1,200 collected · $1,200 by the 18th");
        expect(ROI_LINE).toBe("$2,400 arranged · 1 call · 0 staff hours");
        expect(SATISFACTION_FROM).toBe(3.8);
        expect(SATISFACTION_TO).toBe(4.6);
        expect(dollars(BOOK_DOLLARS)).toBe("$7,560.00");
        expect(dollars(PAST_DUE_END)).toBe("$6,360.00");
        expect(bookPercent(COLLECTED_DOLLARS)).toBe("15.9%");
        expect(bookPercent(SCHEDULED_DOLLARS)).toBe("15.9%");
        expect(bookPercent(ARRANGED_DOLLARS)).toBe("31.7%");
    });

    it("names AppFolio and uses the home metrics instead of the old counters", () => {
        expect(SYNC_HEADLINE).toBe("Syncing from your property management software");
        expect(SOURCE_NAME).toBe("AppFolio");
        expect(NEEDS_YOU_HEADING).toBe("Needs you");
        expect(HOME_TILES).toEqual([
            ["Rent collection rate", "—"],
            ["Median speed of resolution", "—"],
            ["Average touches to collect", "—"],
            ["Recovered", "—"],
            ["Still overdue", "$7,560.00"],
            ["Promised", "—"],
        ]);
        expect(FUNNEL_AT_SYNC).toEqual({ calls: 0, plans: 0, paid: 0 });
        expect(ACTIVITY_EMPTY).toBe("No recent activity.");
        expect(PORTFOLIO_COUNTS).toEqual([
            ["Properties", 18],
            ["Units", 63],
            ["Leases", 61],
            ["Tenants", 72],
            ["Work Orders", 14],
        ]);
        const shown = HOME_TILES.map(([label]) => label);
        for (const [label] of PORTFOLIO_COUNTS) {
            expect(shown).not.toContain(label);
        }
    });

    it("follows Mia's call without a person handoff", () => {
        expect(MIA_OPENER).toBe(VOICE_LINE_MIA);
        expect(MIA_OPENER).not.toContain("an AI assistant");
        expect(CALL_LINES.map((line) => line.text).join(" ")).toContain("My hours got cut");
        expect(CALL_LINES.map((line) => line.text).join(" ")).toContain("August and September both came in late");
        expect(ASSIST_LINE).toContain("I've texted you the city rental assistance link and helpline");
        expect(ASSISTANCE_URL).toBe("sf.gov/renthelp");
        expect(OFFER_LINES.map((line) => line.text)).toEqual([
            "Half. $1,200.",
            "$1,200 today and the rest by the 18th.",
            "Yes. Send it.",
            "It's on your phone.",
            "$1,200 received.",
        ]);
        expect(JOHN_QUOTE).toBe("Nobody's ever actually called me before.");
        expect(DEMO30_HARDSHIP_SCORE).toBeGreaterThan(DEMO30_FLAG_LINE);
        expect(DEMO30_DISPUTE).toBeLessThan(DEMO30_FLAG_LINE);
        expect(DEMO30_DISTRESSED).toBeLessThan(DEMO30_FLAG_LINE);
        expect(TENANTS[0]?.amount).toBe("$2,400.00");
        expect(TENANTS[0]?.status).toBe("Overdue");
    });
});
