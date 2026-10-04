/**
 * @module remotion/submission/Film
 * RentRecoverySubmission. The guide prop only adds pixels.
 * Music, ring, and drop-in audio stay on both renders.
 * Depends on: asset-flags, captions, chrome, scenes, timing.
 * Used by: Root.
 */

import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../components/chrome";
import { fontSans } from "../fonts";
import { theme } from "../theme";
import { ASSET_FLAGS } from "./asset-flags";
import { GUIDE_CUES, isScriptDucked, localFrameAtPhrase } from "./captions";
import { SubmissionSection } from "./scenes";
import {
    sectionById,
    sectionFrames,
    sectionSlate,
    SECTIONS,
    VO_OFFSETS_SEC,
} from "./timing";

const BED = 0.2;
const DUCK_GAIN = 10 ** (-13.5 / 20);

export interface ISubmissionProps {
    readonly guide: boolean;
    readonly showLiveCallsOverlay: boolean;
}

export const submissionAssemblyProps: ISubmissionProps = {
    guide: false,
    showLiveCallsOverlay: false,
};

export const submissionGuideProps: ISubmissionProps = {
    guide: true,
    showLiveCallsOverlay: false,
};

function fileDuck(frame: number): boolean {
    if (ASSET_FLAGS.hasVo) {
        return true;
    }
    const live = sectionFrames(sectionById("livecall"));
    const inLive = frame >= live.from && frame < live.from + live.duration;
    if (inLive && (ASSET_FLAGS.hasCall || ASSET_FLAGS.hasCallAudio)) {
        return true;
    }
    return SECTIONS.some((section, index) => {
        if (!ASSET_FLAGS.sectionVo[index]) {
            return false;
        }
        const window = sectionFrames(section);
        return frame >= window.from && frame < window.from + window.duration;
    });
}

function musicVolume(frame: number): number {
    const ducked = isScriptDucked(frame) || fileDuck(frame);
    return BED * (ducked ? DUCK_GAIN : 1);
}

function DropInAudio() {
    const live = sectionFrames(sectionById("livecall"));
    return (
        <>
            { ASSET_FLAGS.hasVo ? <Audio src={ staticFile("submission/vo.wav") } /> : null }
            { ASSET_FLAGS.hasVo ? null : SECTIONS.map((section, index) => {
                if (!ASSET_FLAGS.sectionVo[index]) {
                    return null;
                }
                const window = sectionFrames(section);
                const offset = Math.round((VO_OFFSETS_SEC[index] ?? 0) * 30);
                return (
                    <Sequence
                        from={ Math.max(0, window.from + offset) }
                        key={ section.id }
                    >
                        <Audio src={ staticFile(`submission/vo-0${index + 1}.wav`) } />
                    </Sequence>
                );
            }) }
            { ASSET_FLAGS.hasCallAudio ? (
                <Sequence
                    durationInFrames={ live.duration }
                    from={ live.from }
                >
                    <Audio src={ staticFile("submission/call-audio.wav") } />
                </Sequence>
            ) : null }
        </>
    );
}

function GuideChrome() {
    const frame = useCurrentFrame();
    const section = SECTIONS.find((item) => {
        const window = sectionFrames(item);
        return frame >= window.from && frame < window.from + window.duration;
    });
    const local = section ? frame - sectionFrames(section).from : 0;
    const minutes = Math.floor(frame / 30 / 60);
    const seconds = Math.floor(frame / 30) % 60;
    const clock = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    return (
        <>
            { section && local < 90 ? (
                <div
                    style={ {
                        background: theme.ink,
                        borderRadius: 12,
                        color: theme.mint,
                        fontFamily: fontSans,
                        fontSize: 28,
                        fontWeight: 700,
                        left: 48,
                        padding: "14px 22px",
                        position: "absolute",
                        top: 36,
                        zIndex: 5,
                    } }
                >
                    { sectionSlate(section) }
                </div>
            ) : null }
            <div
                style={ {
                    background: theme.white,
                    borderRadius: 10,
                    color: theme.ink,
                    fontFamily: fontSans,
                    fontSize: 24,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 700,
                    padding: "8px 14px",
                    position: "absolute",
                    right: 48,
                    top: 36,
                    zIndex: 5,
                } }
            >
                { clock }
            </div>
            { GUIDE_CUES.map((cue) => (
                <Sequence
                    durationInFrames={ Math.max(1, cue.endFrame - cue.startFrame) }
                    from={ cue.startFrame }
                    key={ `${cue.sectionId}-${cue.startFrame}` }
                >
                    <Caption text={ cue.text } />
                </Sequence>
            )) }
        </>
    );
}

function readProps(props: Record<string, unknown>): ISubmissionProps {
    return {
        guide: props.guide === true,
        showLiveCallsOverlay: props.showLiveCallsOverlay === true,
    };
}

export function SubmissionFilm(props: Record<string, unknown>) {
    const { guide, showLiveCallsOverlay } = readProps(props);
    const ring = sectionFrames(sectionById("ring"));
    const ringAt = localFrameAtPhrase("ring", "Nobody");
    return (
        <AbsoluteFill style={ { background: theme.bg, fontFamily: fontSans } }>
            <Audio
                src={ staticFile("submission/music.mp3") }
                volume={ musicVolume }
            />
            <Sequence
                durationInFrames={ ring.duration - ringAt }
                from={ ring.from + ringAt }
            >
                <Audio
                    src={ staticFile("submission/ring.wav") }
                    volume={ 0.45 }
                />
            </Sequence>
            <DropInAudio />
            { SECTIONS.map((section) => {
                const window = sectionFrames(section);
                return (
                    <Sequence
                        durationInFrames={ window.duration }
                        from={ window.from }
                        key={ section.id }
                    >
                        <SubmissionSection
                            id={ section.id }
                            overlay={ showLiveCallsOverlay }
                        />
                    </Sequence>
                );
            }) }
            { guide ? <GuideChrome /> : null }
        </AbsoluteFill>
    );
}
