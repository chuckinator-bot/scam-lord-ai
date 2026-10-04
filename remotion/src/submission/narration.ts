/**
 * @module remotion/submission/narration
 * Spoken copy for RentRecoverySubmission. Edit this file, then the guide
 * captions and the SRT. Do not reword a line anywhere else.
 * Depends on: timing.
 * Used by: captions, scenes, tests.
 */

import type { TSectionId } from "./timing";

export const NARRATION: Record<TSectionId, string> = {
    close: "John gets a plan that fits his payday instead of a late-fee letter. The manager gets paid today, with no notice and no filing. 64 billion dollars of rent comes due every month. Some of it just needs a phone call. RentRecovery.",
    home: "While Mia talks, the manager's dashboard updates live: rent recovered, still overdue, promised on plans, and how fast the first call went out. A short list shows what actually needs a person. Every call is there, step by step, with the transcript.",
    livecall: "",
    oldway: "Today a property manager's toolkit is a late fee, a notice on the door, and 3.6 million eviction filings a year. It's slow, it costs everyone, and it loses the tenant. Only one in five operators is very satisfied with it.",
    ring: "What's missing is a conversation the day rent goes late. Nobody has time to make that call. So we built Mia, an AI voice agent.",
    stats: "Renters in America paid 772 billion dollars in rent last year. Nearly one in four fell behind at least once. That's not bad tenants: half of renter households spend over thirty percent of their income on housing.",
};

export const STAT_RENT = "$772B rent paid last year";
export const STAT_BEHIND = "Nearly 1 in 4 fell behind at least once";
export const STAT_BURDEN = "Half of renter households spend over 30% of income on housing";

export const CALLOUT_FILINGS = "3.6M eviction filings a year";
export const CALLOUT_SATISFIED = "Only 1 in 5 operators is very satisfied";

export const CLOSE_TAGLINE = "$64B of rent comes due every month. Some of it just needs a phone call.";

export const LIVE_CALL_SLATE = "LIVE CALL FOOTAGE";

export type TLiveSpeaker = "John" | "Mia" | "SMS";

export interface ILiveCallLine {
    readonly speaker: TLiveSpeaker;
    readonly text: string;
}

/**
 * Condensed Mia / John call for the guide. Lines are splits of the approved
 * script, in order. They do not add a claim the script did not make.
 */
export const LIVE_CALL_LINES: readonly ILiveCallLine[] = [
    { speaker: "Mia", text: "Hi, is this John? It's Mia from Sunset Properties." },
    { speaker: "John", text: "Yeah." },
    { speaker: "Mia", text: "Your tap repair is booked for Thursday." },
    { speaker: "Mia", text: "The main reason I'm calling is your rent." },
    { speaker: "Mia", text: "October's $2,400 is unpaid, and August and September both came in late." },
    { speaker: "John", text: "Thursday? I've been waiting two weeks on that leaky faucet." },
    { speaker: "John", text: "And honestly, I can't cover the rent. My hours got cut." },
    { speaker: "Mia", text: "I've texted you the city rental assistance link and helpline." },
    { speaker: "SMS", text: "sf.gov/renthelp" },
    { speaker: "John", text: "Half. $1,200." },
    { speaker: "Mia", text: "$1,200 today and the rest by the 18th." },
    { speaker: "John", text: "Yes. Send it." },
    { speaker: "Mia", text: "It's on your phone." },
    { speaker: "Mia", text: "$1,200 received." },
    { speaker: "John", text: "Nobody's ever actually called me before." },
    { speaker: "Mia", text: "Thanks, John." },
];
