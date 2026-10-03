/**
 * @module remotion/beats
 * Frame timing for the three RentRecovery films. 30 fps, 1920x1080.
 * Depends on: none.
 * Used by: compositions, captions, tests.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export interface IBeat {
    readonly id: string;
    readonly from: number;
    readonly durationInFrames: number;
    /** Burned-in lower third. Null during the shared intro. */
    readonly caption: string | null;
    /** Line written into the .srt for this beat. */
    readonly srt: string;
}

export interface IFilm {
    readonly id: string;
    readonly durationInFrames: number;
    readonly beats: readonly IBeat[];
}

const PORTFOLIO_CAPTION = "Portfolio syncs to Supabase. Row-level security keeps each landlord in their own rows.";
const WEBHOOK_CAPTION = "The overdue invoice starts the call on its own.";
const CALL_CAPTION = "Tenant asks for 4 payments. Policy caps it at 2, and Claude counters inside that limit.";
const HARDSHIP_CAPTION = "Hardship score hits 0.82. A person takes it from here.";
const PAY_CAPTION = "Link lands by text and email. Paid before the call ends.";
const LOCKUP_CAPTION = "Built at the Supabase hackathon.";
const TEASER_OFFER_CAPTION = "$800.00 today, $1,600.00 on the 14th. Lawn mowed Saturday.";

const introBeats: readonly IBeat[] = [
    {
        id: "late",
        from: 0,
        durationInFrames: 60,
        caption: null,
        srt: "RENT IS LATE.\nJohn Smith\n$2,400 overdue",
    },
    {
        id: "chase",
        from: 60,
        durationInFrames: 60,
        caption: null,
        srt: "Someone has to chase it.\nNot anymore.",
    },
    {
        id: "wake",
        from: 120,
        durationInFrames: 90,
        caption: null,
        srt: "Hi John, this is RentRecovery, an AI assistant calling on behalf of Sunset Properties",
    },
    {
        id: "split",
        from: 210,
        durationInFrames: 60,
        caption: null,
        srt: "$2,400 OVERDUE\n$800 PAID\n$1,600 SCHEDULED",
    },
    {
        id: "brand",
        from: 270,
        durationInFrames: 60,
        caption: null,
        srt: "RentRecovery\nFrom overdue to paid.",
    },
];

function place(beats: readonly Omit<IBeat, "from">[], origin: number): IBeat[] {
    let cursor = origin;
    return beats.map((beat) => {
        const placed: IBeat = { ...beat, from: cursor };
        cursor += beat.durationInFrames;
        return placed;
    });
}

function film(id: string, beats: readonly IBeat[]): IFilm {
    const durationInFrames = beats.reduce((sum, beat) => sum + beat.durationInFrames, 0);
    return { id, durationInFrames, beats };
}

const demoStory = place(
    [
        {
            id: "portfolio",
            durationInFrames: 270,
            caption: PORTFOLIO_CAPTION,
            srt: PORTFOLIO_CAPTION,
        },
        {
            id: "webhook",
            durationInFrames: 210,
            caption: WEBHOOK_CAPTION,
            srt: WEBHOOK_CAPTION,
        },
        {
            id: "call",
            durationInFrames: 340,
            caption: CALL_CAPTION,
            srt: CALL_CAPTION,
        },
        {
            id: "hardship",
            durationInFrames: 300,
            caption: HARDSHIP_CAPTION,
            srt: HARDSHIP_CAPTION,
        },
        {
            id: "pay",
            durationInFrames: 231,
            caption: PAY_CAPTION,
            srt: PAY_CAPTION,
        },
        {
            id: "lockup",
            durationInFrames: 150,
            caption: LOCKUP_CAPTION,
            srt: LOCKUP_CAPTION,
        },
    ],
    introBeats.reduce((sum, beat) => sum + beat.durationInFrames, 0),
);

const teaserStory = place(
    [
        {
            id: "chain",
            durationInFrames: 150,
            caption: WEBHOOK_CAPTION,
            srt: WEBHOOK_CAPTION,
        },
        {
            id: "offer",
            durationInFrames: 150,
            caption: TEASER_OFFER_CAPTION,
            srt: TEASER_OFFER_CAPTION,
        },
        {
            id: "lockup",
            durationInFrames: 120,
            caption: LOCKUP_CAPTION,
            srt: LOCKUP_CAPTION,
        },
    ],
    introBeats.reduce((sum, beat) => sum + beat.durationInFrames, 0),
);

export const INTRO: IFilm = film("RentRecoveryIntro", introBeats);
export const DEMO: IFilm = film("RentRecoveryDemo", [...introBeats, ...demoStory]);
export const TEASER: IFilm = film("RentRecoveryTeaser", [...introBeats, ...teaserStory]);

export const FILMS: readonly IFilm[] = [INTRO, DEMO, TEASER];

export function beatById(filmSpec: IFilm, id: string): IBeat {
    const beat = filmSpec.beats.find((item) => item.id === id);
    if (!beat) {
        throw new Error(`Missing beat ${id} on ${filmSpec.id}`);
    }
    return beat;
}

/** A settled frame inside the beat, past the entrance blur. */
export function stillFrame(beat: IBeat): number {
    const offset = Math.min(
        beat.durationInFrames - 1,
        Math.max(12, Math.floor(beat.durationInFrames * 0.62)),
    );
    return beat.from + offset;
}

export function framesToTimestamp(frame: number): string {
    const totalMs = Math.round((frame / FPS) * 1000);
    const hours = Math.floor(totalMs / 3_600_000);
    const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
    const seconds = Math.floor((totalMs % 60_000) / 1000);
    const millis = totalMs % 1000;
    const pad = (value: number, size: number) => String(value).padStart(size, "0");
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(millis, 3)}`;
}

export function filmToSrt(filmSpec: IFilm): string {
    return filmSpec.beats
        .map((beat, index) => {
            const start = framesToTimestamp(beat.from);
            const end = framesToTimestamp(beat.from + beat.durationInFrames);
            return `${index + 1}\n${start} --> ${end}\n${beat.srt}\n`;
        })
        .join("\n");
}
