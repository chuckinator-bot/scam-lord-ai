/**
 * @module remotion/split-swap
 * Local frames for the 7s-9s amount swap. Overdue leaves before the paid lines arrive.
 * Depends on: none.
 * Used by: SplitBeat, tests.
 */

/** First local frame of the overdue exit. */
export const SPLIT_EXIT_START = 4;

/** Local frame when overdue is fully gone. Eight frames after the exit starts. */
export const SPLIT_EXIT_END = 12;

/** Local frame when $800 PAID and $1,600 SCHEDULED may appear. Same frame as the tick. */
export const SPLIT_ENTER_START = 12;

export function splitExitFrameCount(): number {
    return SPLIT_EXIT_END - SPLIT_EXIT_START;
}

export function overdueOnScreen(frame: number): boolean {
    return frame < SPLIT_EXIT_END;
}

export function paidOnScreen(frame: number): boolean {
    return frame >= SPLIT_ENTER_START;
}
