/**
 * @module remotion/submission/captions
 * Guide captions and the SRT. Chunks come from the narration file.
 * Pace is 2.5 words a second from each section start.
 * Depends on: beats, narration, timing.
 * Used by: Film, scenes, the SRT writer, tests.
 */

import { framesToTimestamp } from "../beats";
import { LIVE_CALL_LINES, NARRATION } from "./narration";
import {
    sectionById,
    sectionFrames,
    SECTIONS,
    type TSectionId,
} from "./timing";

/** 30 fps / 2.5 words per second. */
export const FRAMES_PER_WORD = 12;

export interface IGuideCue {
    readonly endFrame: number;
    readonly sectionId: TSectionId;
    readonly startFrame: number;
    readonly text: string;
}

export interface ISectionOverage {
    readonly seconds: number;
    readonly sectionId: TSectionId;
}

function wordList(text: string): string[] {
    return text.trim().split(/\s+/).filter((word) => word.length > 0);
}

function sentences(paragraph: string): string[] {
    return paragraph
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);
}

/** True when `count` words can be packed into pieces of 6–10. */
function canPack(count: number): boolean {
    if (count === 0) {
        return true;
    }
    if (count >= 6 && count <= 10) {
        return true;
    }
    if (count < 6) {
        return false;
    }
    const largest = Math.min(10, count - 6);
    for (let take = largest; take >= 6; take -= 1) {
        if (canPack(count - take)) {
            return true;
        }
    }
    return false;
}

/**
 * Keep a sentence intact through 12 words (the 11-word lines, and
 * "RentRecovery."). Longer sentences break on comma or colon when that
 * lands a 6–10 word piece, otherwise on a 6–10 word boundary.
 */
function splitTokens(tokens: string[], intactLimit: number): string[][] {
    const count = tokens.length;
    if (count <= intactLimit) {
        return [tokens];
    }
    let bestCut = -1;
    let bestScore = -1;
    for (let cut = 6; cut <= 10; cut += 1) {
        if (!canPack(count - cut)) {
            continue;
        }
        const boundary = /[,:;]$/.test(tokens[cut - 1] ?? "");
        const score = (boundary ? 100 : 0) + cut;
        if (score > bestScore) {
            bestScore = score;
            bestCut = cut;
        }
    }
    if (bestCut < 0) {
        throw new Error(`Cannot chunk: ${tokens.join(" ")}`);
    }
    const head = tokens.slice(0, bestCut);
    const rest = splitTokens(tokens.slice(bestCut), 10);
    return [head, ...rest];
}

function chunkParagraph(paragraph: string): string[] {
    return sentences(paragraph).flatMap((sentence) => {
        const tokens = wordList(sentence);
        return splitTokens(tokens, 12).map((group) => group.join(" "));
    });
}

function narrationCues(): IGuideCue[] {
    const cues: IGuideCue[] = [];
    for (const section of SECTIONS) {
        const paragraph = NARRATION[section.id];
        if (paragraph.length === 0) {
            continue;
        }
        const window = sectionFrames(section);
        let wordCursor = 0;
        for (const text of chunkParagraph(paragraph)) {
            const words = wordList(text).length;
            const startFrame = window.from + wordCursor * FRAMES_PER_WORD;
            const naturalEnd = window.from + (wordCursor + words) * FRAMES_PER_WORD;
            const sectionEnd = window.from + window.duration;
            cues.push({
                endFrame: Math.min(naturalEnd, sectionEnd),
                sectionId: section.id,
                startFrame,
                text,
            });
            wordCursor += words;
        }
    }
    return cues;
}

function liveCallCues(): IGuideCue[] {
    const section = sectionById("livecall");
    const window = sectionFrames(section);
    const count = LIVE_CALL_LINES.length;
    return LIVE_CALL_LINES.map((line, index) => {
        const startFrame = window.from + Math.round((index * window.duration) / count);
        const endFrame = window.from + Math.round(((index + 1) * window.duration) / count);
        return {
            endFrame,
            sectionId: "livecall" as const,
            startFrame,
            text: `[live call] ${line.speaker}: ${line.text}`,
        };
    });
}

export const GUIDE_CUES: readonly IGuideCue[] = [...narrationCues(), ...liveCallCues()];

export function sectionOverage(): readonly ISectionOverage[] {
    return SECTIONS.flatMap((section) => {
        const paragraph = NARRATION[section.id];
        if (paragraph.length === 0) {
            return [];
        }
        const spokenFrames = wordList(paragraph).length * FRAMES_PER_WORD;
        const window = sectionFrames(section);
        const extra = spokenFrames - window.duration;
        if (extra <= 0) {
            return [];
        }
        return [{ seconds: extra / 30, sectionId: section.id }];
    });
}

/** Local frame, inside the section, when `phrase` is spoken. */
export function localFrameAtPhrase(sectionId: TSectionId, phrase: string): number {
    const text = NARRATION[sectionId];
    const at = text.indexOf(phrase);
    if (at < 0) {
        throw new Error(`Phrase not in ${sectionId}: ${phrase}`);
    }
    const prior = text.slice(0, at).trim();
    const wordIndex = prior.length === 0 ? 0 : wordList(prior).length;
    return wordIndex * FRAMES_PER_WORD;
}

export function guideSrt(): string {
    return GUIDE_CUES.map((cue, index) => {
        const start = framesToTimestamp(cue.startFrame);
        const end = framesToTimestamp(cue.endFrame);
        return `${index + 1}\n${start} --> ${end}\n${cue.text}\n`;
    }).join("\n");
}

/** Music ducks under scripted narration and the whole live-call slot. */
export function isScriptDucked(frame: number): boolean {
    const live = sectionFrames(sectionById("livecall"));
    if (frame >= live.from && frame < live.from + live.duration) {
        return true;
    }
    return GUIDE_CUES.some((cue) => {
        return cue.sectionId !== "livecall"
            && frame >= cue.startFrame
            && frame < cue.endFrame;
    });
}

export function cuesFor(sectionId: TSectionId): readonly IGuideCue[] {
    return GUIDE_CUES.filter((cue) => cue.sectionId === sectionId);
}
