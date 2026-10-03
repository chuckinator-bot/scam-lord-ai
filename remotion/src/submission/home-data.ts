/**
 * @module remotion/submission/home-data
 * Home tab figures copied from scripts/seed-home-portfolio.ts.
 * Paid / recovered $10,660. Still overdue $13,740. Promised $9,110.
 * The seed's minutes field is time from first touch to the paid call, so
 * Time to first call stays blank. Money tiles are seed sums.
 * Depends on: none.
 * Used by: scenes, tests.
 */

export const RECOVERED_DOLLARS = 10_660;
export const STILL_OVERDUE_DOLLARS = 13_740;
export const PROMISED_DOLLARS = 9_110;

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
    { id: "speed", label: "Time to first call", value: "—" },
];

export interface INeedsYouRow {
    readonly property: string;
    readonly reason: string;
    readonly tenant: string;
}

export const NEEDS_YOU: readonly INeedsYouRow[] = [
    { property: "Maple Court · 1A", reason: "dispute", tenant: "Drew Okonkwo" },
    { property: "River View Apartments · 5", reason: "distressed", tenant: "Finley Grant" },
    { property: "River View Apartments · 15", reason: "hardship", tenant: "Quinn Alvarez" },
];

export const NEEDS_YOU_HEADING = "Needs you";

export interface IOpenCall {
    readonly amount: string;
    readonly line: string;
    readonly property: string;
    readonly status: "In progress";
    readonly step: string;
    readonly tenant: string;
}

export const OPEN_CALL: IOpenCall = {
    amount: formatDollars(1_650),
    line: "I got hit with a short week at work. I can catch up.",
    property: "Maple Court · 5D",
    status: "In progress",
    step: "Jev check",
    tenant: "Casey Nguyen",
};
