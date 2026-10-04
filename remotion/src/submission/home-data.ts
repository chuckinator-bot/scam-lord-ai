/**
 * @module remotion/submission/home-data
 * Home tab figures copied from scripts/seed-home-portfolio.ts.
 * Paid / recovered $10,660. Still overdue $13,740. Promised $9,110.
 * Those three sums stay the seed totals. Time to first call reads 4 min.
 * John Smith is an extra Needs you row and the open call. His $2,400,
 * then $1,200 received and $1,200 by the 18th, is the hype story.
 * Depends on: none.
 * Used by: scenes, tests.
 */

export const RECOVERED_DOLLARS = 10_660;
export const STILL_OVERDUE_DOLLARS = 13_740;
export const PROMISED_DOLLARS = 9_110;
export const TIME_TO_FIRST_CALL = "4 min";
export const DEMO_DATA_TAG = "Demo data";

export function formatDollars(amount: number): string {
    const [whole, frac] = amount.toFixed(2).split(".");
    const withCommas = (whole ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${withCommas}.${frac}`;
}

export interface IHomeTile {
    readonly id: "overdue" | "promised" | "recovered" | "speed";
    readonly label: string;
    readonly value: string;
}

export const HOME_TILES: readonly IHomeTile[] = [
    { id: "recovered", label: "Rent recovered", value: formatDollars(RECOVERED_DOLLARS) },
    { id: "overdue", label: "Still overdue", value: formatDollars(STILL_OVERDUE_DOLLARS) },
    { id: "promised", label: "Promised on plans", value: formatDollars(PROMISED_DOLLARS) },
    { id: "speed", label: "Time to first call", value: TIME_TO_FIRST_CALL },
];

export interface INeedsYouRow {
    readonly property: string;
    readonly reason: string;
    readonly tenant: string;
}

export const NEEDS_YOU: readonly INeedsYouRow[] = [
    { property: "Sunset Properties · Unit 4", reason: "$2,400 overdue", tenant: "John Smith" },
    { property: "Maple Court · 1A", reason: "dispute", tenant: "Drew Okonkwo" },
    { property: "River View Apartments · 5", reason: "distressed", tenant: "Finley Grant" },
    { property: "River View Apartments · 15", reason: "hardship", tenant: "Quinn Alvarez" },
];

export const NEEDS_YOU_HEADING = "Needs you";

export interface IOpenCallLine {
    readonly chip: "Overdue" | "Paid" | "Plan active";
    readonly text: string;
}

export interface IOpenCall {
    readonly lines: readonly IOpenCallLine[];
    readonly property: string;
    readonly tenant: string;
}

export const OPEN_CALL: IOpenCall = {
    lines: [
        { chip: "Overdue", text: "$2,400 overdue" },
        { chip: "Paid", text: "$1,200 received" },
        { chip: "Plan active", text: "$1,200 by the 18th" },
    ],
    property: "Sunset Properties · Unit 4",
    tenant: "John Smith",
};
