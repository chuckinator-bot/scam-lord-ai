/**
 * @module remotion/roster
 * Portfolio tenants. The intro chase cards use the same names and amounts.
 * Depends on: theme status type.
 * Used by: portfolio scene, intro chase beat, tests.
 */

import type { TStatus } from "./theme";

export interface ITenant {
    readonly amount: string;
    readonly due: string;
    readonly name: string;
    readonly place: string;
    readonly status: TStatus;
}

/** Source of truth for names and balances. John Smith stays at $2,400.00. */
export const TENANTS: readonly ITenant[] = [
    {
        amount: "$2,400.00",
        due: "Oct 1, 2026",
        name: "John Smith",
        place: "Sunset Properties · Unit 4",
        status: "Overdue",
    },
    {
        amount: "$960.00",
        due: "Aug 28, 2026",
        name: "Casey Diaz",
        place: "9 Alder · Unit 2",
        status: "Overdue",
    },
    {
        amount: "$1,800.00",
        due: "Sep 1, 2026",
        name: "Avery Cole",
        place: "14 Birch · Unit 1",
        status: "In progress",
    },
    {
        amount: "$2,400.00",
        due: "Sep 3, 2026",
        name: "Blake Nguyen",
        place: "2 Cedar · Unit 3",
        status: "Waiting on payment",
    },
];

/** The three paper slips in the intro chase beat. */
export const CHASE_CARDS: readonly ITenant[] = TENANTS.slice(0, 3);
