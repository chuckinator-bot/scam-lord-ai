/**
 * @module remotion/jev
 * The three Jev questions from the spec: hardship, dispute, distressed.
 * Depends on: none.
 * Used by: hardship scene, tests.
 */

export const FLAG_LINE = 0.35;

export interface IJevQuestion {
    readonly name: "Hardship" | "Dispute" | "Distressed";
    readonly score: number;
}

/** Casey Diaz check. These are the three questions, not a combined total. */
export const CASEY_QUESTIONS: readonly IJevQuestion[] = [
    { name: "Hardship", score: 0.82 },
    { name: "Dispute", score: 0.1 },
    { name: "Distressed", score: 0.4 },
];

export function isFlagged(score: number): boolean {
    return score >= FLAG_LINE;
}
