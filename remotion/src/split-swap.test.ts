/**
 * @module remotion/split-swap.test
 * The overdue figure is gone before the paid lines enter.
 * Depends on: split-swap, beats.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { INTRO } from "./beats";
import {
    overdueOnScreen,
    paidOnScreen,
    SPLIT_ENTER_START,
    SPLIT_EXIT_END,
    SPLIT_EXIT_START,
    SPLIT_SETTLE_FRAMES,
    splitExitFrameCount,
} from "./split-swap";

describe("intro amount swap", () => {
    it("keeps the intro at 330 frames", () => {
        expect(INTRO.durationInFrames).toBe(330);
    });

    it("gives the overdue figure a 6 to 8 frame exit", () => {
        const frames = splitExitFrameCount();
        expect(frames).toBeGreaterThanOrEqual(6);
        expect(frames).toBeLessThanOrEqual(8);
        expect(SPLIT_EXIT_END - SPLIT_EXIT_START).toBe(frames);
    });

    it("starts the paid lines only after overdue has left", () => {
        expect(SPLIT_ENTER_START).toBeGreaterThanOrEqual(SPLIT_EXIT_END);
        for (let frame = SPLIT_EXIT_START; frame < SPLIT_EXIT_END; frame += 1) {
            expect(overdueOnScreen(frame)).toBe(true);
            expect(paidOnScreen(frame)).toBe(false);
        }
        expect(overdueOnScreen(SPLIT_EXIT_END)).toBe(false);
        expect(paidOnScreen(SPLIT_ENTER_START)).toBe(true);
    });

    it("holds the paid lines at full contrast for at least one second", () => {
        const split = INTRO.beats.find((beat) => beat.id === "split");
        const hold = (split?.durationInFrames ?? 0) - (SPLIT_ENTER_START + SPLIT_SETTLE_FRAMES);
        expect(hold).toBeGreaterThanOrEqual(30);
        expect(INTRO.durationInFrames).toBe(330);
    });
});
