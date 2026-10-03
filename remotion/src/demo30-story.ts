/**
 * @module remotion/demo30-story
 * Numbers and lines for the 30-second film. Every figure comes from the roster
 * and from John's $800 collected / $1,600 scheduled plan.
 * Depends on: beats, roster, call turn type.
 * Used by: Demo30 scenes, tests.
 */

import { DEMO30_LINK_FRAME, VOICE_LINE_V7 } from "./beats";
import type { ICallTurn } from "./scenes/story";
import { TENANTS } from "./roster";

export const BOOK_DOLLARS = TENANTS.reduce((sum, tenant) => {
    return sum + Number(tenant.amount.replace(/[$,]/g, ""));
}, 0);
export const COLLECTED_DOLLARS = 800;
export const SCHEDULED_DOLLARS = 1_600;
export const OPEN_DOLLARS = BOOK_DOLLARS - COLLECTED_DOLLARS;
export const ARRANGED_DOLLARS = COLLECTED_DOLLARS + SCHEDULED_DOLLARS;
/** Casey, Avery, and Blake. Their balances are not part of John's plan. */
export const UNTOUCHED_DOLLARS = OPEN_DOLLARS - SCHEDULED_DOLLARS;
/** John's $2,400 is resolved, so past due falls from the roster total to what remains. */
export const PAST_DUE_END = BOOK_DOLLARS - ARRANGED_DOLLARS;
export const PLAN_LINE = "$800 collected · $1,600 on a plan";
export const ROI_LINE = "$2,400 arranged · 1 call · 0 staff hours";
export const SATISFACTION_FROM = 3.8;
export const SATISFACTION_TO = 4.6;

export const SYNC_HEADLINE = "Syncing from your property management software";
export const SOURCE_NAME = "AppFolio";

/** Portfolio totals. The table underneath is only the rows that need attention. */
export const PORTFOLIO_COUNTS: readonly (readonly [string, number])[] = [
    ["Properties", 18],
    ["Units", 63],
    ["Leases", 61],
    ["Tenants", 72],
    ["Work Orders", 14],
];

export function dollars(amount: number): string {
    const body = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${body}.00`;
}

/** Share of the overdue book, one decimal. Scheduled money is not called collected. */
export function bookPercent(amount: number): string {
    return `${((amount / BOOK_DOLLARS) * 100).toFixed(1)}%`;
}

export const DEMO30_TURNS: readonly ICallTurn[] = [
    {
        at: 4,
        plan: false,
        speaker: "RentRecovery",
        tenant: false,
        text: `${VOICE_LINE_V7} The open balance is $2,400.00.`,
    },
    {
        at: 28,
        plan: false,
        speaker: "John Smith",
        tenant: true,
        text: "Can I split this into 4 payments?",
    },
    {
        at: 52,
        plan: true,
        speaker: "RentRecovery",
        tenant: false,
        text: "$800.00 today and $1,600.00 on the 14th. We'll mow the lawn Saturday.",
    },
    {
        at: DEMO30_LINK_FRAME,
        plan: false,
        speaker: "John Smith",
        tenant: true,
        text: "Send the link.",
    },
];

/** Policy card arrives with the counter-offer. */
export const DEMO30_POLICY_FRAME = 44;
