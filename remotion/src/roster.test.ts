/**
 * @module remotion/roster.test
 * Intro chase cards use the portfolio names and amounts.
 * Depends on: roster.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { CHASE_CARDS, TENANTS } from "./roster";

describe("tenant roster", () => {
    it("uses the portfolio row for each intro chase card", () => {
        expect(CHASE_CARDS.map((tenant) => tenant.name)).toEqual([
            "John Smith",
            "Casey Diaz",
            "Avery Cole",
        ]);
        expect(CHASE_CARDS.map((tenant) => tenant.amount)).toEqual([
            "$2,400.00",
            "$960.00",
            "$1,800.00",
        ]);
        for (const card of CHASE_CARDS) {
            expect(TENANTS).toContainEqual(card);
        }
    });
});
