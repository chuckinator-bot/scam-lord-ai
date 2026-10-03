/**
 * @module remotion/jev.test
 * Hardship and distressed clear 0.35. Dispute does not. None of them is a total.
 * Depends on: jev.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { CASEY_QUESTIONS, isFlagged } from "./jev";

describe("Jev questions", () => {
    it("uses the spec names hardship, dispute, and distressed", () => {
        expect(CASEY_QUESTIONS.map((question) => question.name)).toEqual([
            "Hardship",
            "Dispute",
            "Distressed",
        ]);
        expect(CASEY_QUESTIONS.map((question) => question.score)).toEqual([0.82, 0.1, 0.4]);
    });

    it("flags only the questions at or above 0.35", () => {
        expect(CASEY_QUESTIONS.filter((question) => isFlagged(question.score)).map((question) => question.name))
            .toEqual(["Hardship", "Distressed"]);
    });
});
