/**
 * @module remotion/demo30-story
 * Numbers and lines for the 30-second film. John's October rent is $2,400.
 * $1,200 is collected on the call and $1,200 is due by the 18th, so past due
 * falls by the collected amount only.
 * Depends on: beats, roster.
 * Used by: Demo30 scenes, tests.
 */

import { DEMO30_FLAG_LINE, DEMO30_HARDSHIP_SCORE, VOICE_LINE_MIA } from "./beats";
import { TENANTS } from "./roster";
import type { ICallTurn } from "./scenes/story";

export const BOOK_DOLLARS = TENANTS.reduce((sum, tenant) => {
    return sum + Number(tenant.amount.replace(/[$,]/g, ""));
}, 0);
export const COLLECTED_DOLLARS = 1_200;
export const SCHEDULED_DOLLARS = 1_200;
export const OPEN_DOLLARS = BOOK_DOLLARS - COLLECTED_DOLLARS;
export const ARRANGED_DOLLARS = COLLECTED_DOLLARS + SCHEDULED_DOLLARS;
/** The other three tenancies. John's remaining $1,200 is still past due. */
export const UNTOUCHED_DOLLARS = BOOK_DOLLARS - ARRANGED_DOLLARS;
/** Collected money leaves past due. The 18th installment stays in the balance. */
export const PAST_DUE_END = BOOK_DOLLARS - COLLECTED_DOLLARS;
export const PLAN_LINE = "$1,200 collected · $1,200 by the 18th";
export const ROI_LINE = "$2,400 arranged · 1 call · 0 staff hours";
export const SATISFACTION_FROM = 3.8;
export const SATISFACTION_TO = 4.6;

export const SYNC_HEADLINE = "Syncing from your property management software";
export const SOURCE_NAME = "AppFolio";

export function dollars(amount: number): string {
    const body = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${body}.00`;
}

/**
 * v8 AppFolio totals. LandlordHome's MetricsBand replaced this row, so the
 * film does not render them. Kept so the swap stays explicit.
 */
export const PORTFOLIO_COUNTS: readonly (readonly [string, number])[] = [
    ["Properties", 18],
    ["Units", 63],
    ["Leases", 61],
    ["Tenants", 72],
    ["Work Orders", 14],
];

/** Home tiles at the sync beat. Null pace and Stripe figures read as an em dash. */
export const HOME_TILES: readonly (readonly [string, string])[] = [
    ["Rent collection rate", "—"],
    ["Median speed of resolution", "—"],
    ["Average touches to collect", "—"],
    ["Recovered", "—"],
    ["Still overdue", dollars(BOOK_DOLLARS)],
    ["Promised", "—"],
];

/** NeedsYou heading. The four roster rows sit in that list. */
export const NEEDS_YOU_HEADING = "Needs you";

/** No calls have been placed yet, so the funnel is empty. */
export const FUNNEL_AT_SYNC = { calls: 0, plans: 0, paid: 0 } as const;

export const ACTIVITY_EMPTY = "No recent activity.";

/** Share of the overdue book, one decimal. Scheduled money is not called collected. */
export function bookPercent(amount: number): string {
    return `${((amount / BOOK_DOLLARS) * 100).toFixed(1)}%`;
}

export interface ITranscriptLine {
    readonly at: number;
    readonly speaker: string;
    readonly tenant: boolean;
    readonly text: string;
}

export const MIA_OPENER = VOICE_LINE_MIA;

export const LEDGER_ROWS: readonly (readonly [string, string])[] = [
    ["October", "Unpaid"],
    ["September", "Late"],
    ["August", "Late"],
];

export const WORK_ORDER = "Tap repair";
export const WORK_ORDER_WHEN = "Thursday";
export const ASSISTANCE_URL = "sf.gov/renthelp";
export const JOHN_QUOTE = "Nobody's ever actually called me before.";

/** Dispute and distressed stay under the flag line. */
export const DEMO30_DISPUTE = 0.1;
export const DEMO30_DISTRESSED = 0.06;

export const CALL_LINES: readonly ITranscriptLine[] = [
    {
        at: 0,
        speaker: "John",
        tenant: true,
        text: "Yeah.",
    },
    {
        at: 10,
        speaker: "Mia",
        tenant: false,
        text: "Your tap repair is booked for Thursday. The main reason I'm calling is your rent. October's $2,400 is unpaid, and August and September both came in late. Can you take care of it today?",
    },
    {
        at: 52,
        speaker: "John",
        tenant: true,
        text: "Thursday? I've been waiting two weeks on that leaky faucet. And honestly, I can't cover the rent. My hours got cut. Is there any help out there for someone like me?",
    },
];

export const ASSIST_LINE = "That's booked either way. I'm sorry about your hours. San Francisco has an emergency rent program that can pay past-due rent straight to the property. I can't promise you'll be approved, but I've texted you the city rental assistance link and helpline. What could you put down today?";

export const OFFER_LINES: readonly ITranscriptLine[] = [
    {
        at: 0,
        speaker: "John",
        tenant: true,
        text: "Half. $1,200.",
    },
    {
        at: 16,
        speaker: "Mia",
        tenant: false,
        text: "$1,200 today and the rest by the 18th.",
    },
    {
        at: 40,
        speaker: "John",
        tenant: true,
        text: "Yes. Send it.",
    },
    {
        at: 58,
        speaker: "Mia",
        tenant: false,
        text: "It's on your phone.",
    },
    {
        at: 72,
        speaker: "Mia",
        tenant: false,
        text: "$1,200 received.",
    },
];

/** Local frame when the paid chip replaces the wait. */
export const OFFER_PAID_FRAME = 72;

/** The paused Demo30 composition still passes these into the shared call scene. */
export const DEMO30_POLICY_FRAME = 44;
export const DEMO30_TURNS: readonly ICallTurn[] = CALL_LINES.map((line) => ({
    at: line.at,
    plan: false,
    speaker: line.speaker,
    tenant: line.tenant,
    text: line.text,
}));

export { DEMO30_FLAG_LINE, DEMO30_HARDSHIP_SCORE };
