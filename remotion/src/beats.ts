/**
 * @module remotion/beats
 * Frame timing for the RentRecovery films. 30 fps, 1920x1080.
 * Depends on: none.
 * Used by: compositions, captions, tests.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Local frame when "Send the link." lands. The call beat holds that line for 2s. */
export const CALL_LINK_FRAME = 210;

/** Casey's gauges replace John's, then her hardship score eases onto 0.82. */
export const CASEY_ENTER_FRAME = 132;
export const CASEY_SCORE_FRAMES = 36;
/** Local frame when Casey's hardship gauge has settled on 0.82. */
export const HARDSHIP_CASEY_CAPTION_FRAME = CASEY_ENTER_FRAME + CASEY_SCORE_FRAMES;

export interface ICaptionCue {
    /** Local frame when this lower third appears. */
    readonly from: number;
    readonly text: string;
}

export interface IBeat {
    readonly id: string;
    readonly from: number;
    readonly durationInFrames: number;
    /** Burned-in lower third. Null during the shared intro. */
    readonly caption: string | null;
    /**
     * Timed lower thirds inside one beat. When set, these replace `caption`
     * on screen and in the .srt so a scene can keep a single frame clock.
     */
    readonly cues?: readonly ICaptionCue[];
    /** Line written into the .srt for this beat, when `cues` is absent. */
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
const HARDSHIP_JOHN_CAPTION = "Every turn gets a hardship check.";
const HARDSHIP_CASEY_CAPTION = "Casey hits 0.82. A person takes it from here.";
/** v6 voice line. Demo and teaser keep this so those renders stay stable. */
export const VOICE_LINE = "Hi John, this is RentRecovery, an AI assistant.";
/** Spoken line for the 11s intro and the 30s demo. */
export const VOICE_LINE_V7 = "Hi John, this is RentRecovery, calling for Sunset Properties.";
const PAY_CAPTION = "Link lands by text and email. Paid before the call ends.";
const LOCKUP_CAPTION = "Built at the Supabase hackathon.";
const TEASER_OFFER_CAPTION = "$800.00 today, $1,600.00 on the 14th. Lawn mowed Saturday.";
const BENEFIT_CAPTION = "Past due drops. Owners get paid.";
const DEMO30_PORTFOLIO_CAPTION = "Syncs from AppFolio into Supabase. Each landlord sees only their rows.";

/** Casey replaces John late enough that her 0.82 gauge has settled when the second caption starts. */
export const DEMO30_CASEY_ENTER_FRAME = 48;
export const DEMO30_CASEY_SCORE_FRAMES = 12;
export const DEMO30_CASEY_CAPTION_FRAME = DEMO30_CASEY_ENTER_FRAME + DEMO30_CASEY_SCORE_FRAMES;
/** Local frame of "Send the link." The negotiation beat holds it for 2s. */
export const DEMO30_LINK_FRAME = 72;
export const DEMO30_FLAG_LINE = 0.75;

function introBeats(voice: string, durations: readonly [number, number, number, number, number]): readonly IBeat[] {
    const [late, chase, wake, split, brand] = durations;
    const from = [
        0,
        late,
        late + chase,
        late + chase + wake,
        late + chase + wake + split,
    ];
    return [
        {
            id: "late",
            from: from[0] ?? 0,
            durationInFrames: late,
            caption: null,
            srt: "RENT IS LATE.\nJohn Smith\n$2,400 overdue",
        },
        {
            id: "chase",
            from: from[1] ?? 0,
            durationInFrames: chase,
            caption: null,
            srt: "Someone has to chase it.\nNot anymore.",
        },
        {
            id: "wake",
            from: from[2] ?? 0,
            durationInFrames: wake,
            caption: null,
            srt: voice,
        },
        {
            id: "split",
            from: from[3] ?? 0,
            durationInFrames: split,
            caption: null,
            srt: "$2,400 OVERDUE\n$800 PAID\n$1,600 SCHEDULED",
        },
        {
            id: "brand",
            from: from[4] ?? 0,
            durationInFrames: brand,
            caption: null,
            srt: "RentRecovery\nFrom overdue to paid.",
        },
    ];
}

/** 11 seconds. Same card order as v6, with the Sunset Properties line. */
const introBeatsV7 = introBeats(VOICE_LINE_V7, [60, 60, 90, 60, 60]);
/** v6 open. Demo and teaser still start on this clock. */
const introBeatsV6 = introBeats(VOICE_LINE, [60, 60, 90, 60, 60]);
/**
 * Three Demo30 cards inside 7.2s. The spoken line is about 3.96s, so the wake
 * card starts at 2.0s and the line finishes over the start of the third card.
 * The fade and chime still end before the portfolio at 7.2s.
 */
const introBeats30: readonly IBeat[] = [
    {
        id: "stakes",
        from: 0,
        durationInFrames: 60,
        caption: null,
        srt: "RENT IS LATE.\nJohn Smith\n$2,400 overdue\nSomeone has to chase it.\nNot anymore.",
    },
    {
        id: "wake",
        from: 60,
        durationInFrames: 72,
        caption: null,
        srt: VOICE_LINE_V7,
    },
    {
        id: "close",
        from: 132,
        durationInFrames: 84,
        caption: null,
        srt: "$2,400 OVERDUE\n$800 PAID\n$1,600 SCHEDULED\nRentRecovery\nFrom overdue to paid.",
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
            durationInFrames: 270,
            caption: CALL_CAPTION,
            srt: CALL_CAPTION,
        },
        {
            id: "hardship",
            durationInFrames: 300,
            caption: HARDSHIP_JOHN_CAPTION,
            cues: [
                { from: 0, text: HARDSHIP_JOHN_CAPTION },
                { from: HARDSHIP_CASEY_CAPTION_FRAME, text: HARDSHIP_CASEY_CAPTION },
            ],
            srt: HARDSHIP_JOHN_CAPTION,
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
    introBeatsV6.reduce((sum, beat) => sum + beat.durationInFrames, 0),
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
    introBeatsV6.reduce((sum, beat) => sum + beat.durationInFrames, 0),
);

const demo30Story = place(
    [
        {
            id: "portfolio",
            durationInFrames: 120,
            caption: DEMO30_PORTFOLIO_CAPTION,
            srt: DEMO30_PORTFOLIO_CAPTION,
        },
        {
            id: "chain",
            durationInFrames: 150,
            caption: WEBHOOK_CAPTION,
            srt: WEBHOOK_CAPTION,
        },
        {
            id: "call",
            durationInFrames: 132,
            caption: CALL_CAPTION,
            srt: CALL_CAPTION,
        },
        {
            id: "hardship",
            durationInFrames: 120,
            caption: HARDSHIP_JOHN_CAPTION,
            cues: [
                { from: 0, text: HARDSHIP_JOHN_CAPTION },
                { from: DEMO30_CASEY_CAPTION_FRAME, text: HARDSHIP_CASEY_CAPTION },
            ],
            srt: HARDSHIP_JOHN_CAPTION,
        },
        {
            id: "benefit",
            durationInFrames: 102,
            caption: BENEFIT_CAPTION,
            srt: BENEFIT_CAPTION,
        },
        {
            id: "lockup",
            durationInFrames: 60,
            caption: LOCKUP_CAPTION,
            srt: LOCKUP_CAPTION,
        },
    ],
    introBeats30.reduce((sum, beat) => sum + beat.durationInFrames, 0),
);

export const INTRO: IFilm = film("RentRecoveryIntro", introBeatsV7);
export const DEMO: IFilm = film("RentRecoveryDemo", [...introBeatsV6, ...demoStory]);
export const TEASER: IFilm = film("RentRecoveryTeaser", [...introBeatsV6, ...teaserStory]);
export const DEMO30: IFilm = film("RentRecoveryDemo30", [...introBeats30, ...demo30Story]);

export const FILMS: readonly IFilm[] = [INTRO, DEMO, TEASER, DEMO30];

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

interface ISrtBlock {
    readonly end: number;
    readonly start: number;
    readonly text: string;
}

function srtBlocks(beat: IBeat): ISrtBlock[] {
    if (beat.cues && beat.cues.length > 0) {
        return beat.cues.map((cue, index) => ({
            end: beat.from + (beat.cues?.[index + 1]?.from ?? beat.durationInFrames),
            start: beat.from + cue.from,
            text: cue.text,
        }));
    }
    return [{
        end: beat.from + beat.durationInFrames,
        start: beat.from,
        text: beat.srt,
    }];
}

export function filmToSrt(filmSpec: IFilm): string {
    return filmSpec.beats
        .flatMap((beat) => srtBlocks(beat))
        .map((block, index) => {
            const start = framesToTimestamp(block.start);
            const end = framesToTimestamp(block.end);
            return `${index + 1}\n${start} --> ${end}\n${block.text}\n`;
        })
        .join("\n");
}
