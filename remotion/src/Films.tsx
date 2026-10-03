/**
 * @module remotion/Films
 * RentRecoveryIntro, RentRecoveryDemo, RentRecoveryTeaser, and RentRecoveryDemo30.
 * Depends on: beats, scenes, chrome.
 * Used by: Root.
 */

import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
    beatById,
    DEMO,
    DEMO30,
    DEMO30_CASEY_ENTER_FRAME,
    DEMO30_CASEY_SCORE_FRAMES,
    DEMO30_FLAG_LINE,
    INTRO,
    TEASER,
    VOICE_LINE,
    VOICE_LINE_V7,
    type IBeat,
    type IFilm,
} from "./beats";
import { fontSans } from "./fonts";
import { Caption, Snap } from "./components/chrome";
import { DEMO30_POLICY_FRAME, DEMO30_TURNS } from "./demo30-story";
import { BrandBeat, ChaseBeat, LateBeat, SplitBeat, WakeBeat } from "./scenes/intro";
import { Demo30Benefit, Demo30Chain, Demo30Close, Demo30Portfolio, Demo30Stakes, Demo30Wake } from "./scenes/demo30";
import {
    CallScene,
    HardshipScene,
    LockupScene,
    PayScene,
    PortfolioScene,
    TeaserChainScene,
    TeaserOfferScene,
    WebhookScene,
} from "./scenes/story";

function Beat({
    children,
    film,
    id,
    snap = 0.04,
}: {
    children: ReactNode;
    film: IFilm;
    id: string;
    snap?: number;
}) {
    const beat = beatById(film, id);
    return (
        <Sequence
            durationInFrames={ beat.durationInFrames }
            from={ beat.from }
            name={ beat.id }
        >
            <Snap amount={ snap }>{ children }</Snap>
            <BeatCaption beat={ beat } />
        </Sequence>
    );
}

function BeatCaption({ beat }: { beat: IBeat }) {
    const cues = beat.cues;
    if (cues && cues.length > 0) {
        return <CuedCaption
            beat={ beat }
            cues={ cues }
        />;
    }
    return beat.caption ? <Caption text={ beat.caption } /> : null;
}

function CuedCaption({
    beat,
    cues,
}: {
    beat: IBeat;
    cues: NonNullable<IBeat["cues"]>;
}) {
    const frame = useCurrentFrame();
    let active = cues[0];
    let nextFrom = beat.durationInFrames;
    for (let index = 0; index < cues.length; index += 1) {
        const cue = cues[index];
        if (cue && frame >= cue.from) {
            active = cue;
            nextFrom = cues[index + 1]?.from ?? beat.durationInFrames;
        }
    }
    if (!active) {
        return null;
    }
    return (
        <Sequence
            durationInFrames={ nextFrom - active.from }
            from={ active.from }
            layout="none"
            name={ `${beat.id}-caption` }
        >
            <Caption text={ active.text } />
        </Sequence>
    );
}

function IntroBeats({
    edition,
    film,
}: {
    edition: "v6" | "v7";
    film: IFilm;
}) {
    return (
        <>
            <Beat
                film={ film }
                id="late"
            >
                <LateBeat />
            </Beat>
            <Beat
                film={ film }
                id="chase"
            >
                <ChaseBeat />
            </Beat>
            <Beat
                film={ film }
                id="wake"
                snap={ 0.03 }
            >
                <WakeBeat
                    line={ edition === "v7" ? VOICE_LINE_V7 : VOICE_LINE }
                    showBadge={ edition === "v6" }
                />
            </Beat>
            <Beat
                film={ film }
                id="split"
            >
                <SplitBeat />
            </Beat>
            <Beat
                film={ film }
                id="brand"
                snap={ 0.02 }
            >
                <BrandBeat />
            </Beat>
        </>
    );
}

export function IntroFilm() {
    return (
        <AbsoluteFill style={ { fontFamily: fontSans } }>
            <style>{ `* { font-family: ${fontSans}, sans-serif; }` }</style>
            <Audio src={ staticFile("audio/intro-v7.wav") } />
            <IntroBeats
                edition="v7"
                film={ INTRO }
            />
        </AbsoluteFill>
    );
}

export function DemoFilm() {
    return (
        <AbsoluteFill style={ { fontFamily: fontSans } }>
            <style>{ `* { font-family: ${fontSans}, sans-serif; }` }</style>
            <Audio src={ staticFile("audio/demo.wav") } />
            <IntroBeats
                edition="v6"
                film={ DEMO }
            />
            <Beat
                film={ DEMO }
                id="portfolio"
            >
                <PortfolioScene />
            </Beat>
            <Beat
                film={ DEMO }
                id="webhook"
                snap={ 0.015 }
            >
                <WebhookScene />
            </Beat>
            <Beat
                film={ DEMO }
                id="call"
            >
                <CallScene />
            </Beat>
            <Beat
                film={ DEMO }
                id="hardship"
            >
                <HardshipScene />
            </Beat>
            <Beat
                film={ DEMO }
                id="pay"
            >
                <PayScene />
            </Beat>
            <Beat
                film={ DEMO }
                id="lockup"
                snap={ 0.02 }
            >
                <LockupScene />
            </Beat>
        </AbsoluteFill>
    );
}

export function TeaserFilm() {
    return (
        <AbsoluteFill style={ { fontFamily: fontSans } }>
            <style>{ `* { font-family: ${fontSans}, sans-serif; }` }</style>
            <Audio src={ staticFile("audio/teaser.wav") } />
            <IntroBeats
                edition="v6"
                film={ TEASER }
            />
            <Beat
                film={ TEASER }
                id="chain"
                snap={ 0.02 }
            >
                <TeaserChainScene />
            </Beat>
            <Beat
                film={ TEASER }
                id="offer"
            >
                <TeaserOfferScene />
            </Beat>
            <Beat
                film={ TEASER }
                id="lockup"
                snap={ 0.02 }
            >
                <LockupScene />
            </Beat>
        </AbsoluteFill>
    );
}

export function Demo30Film() {
    return (
        <AbsoluteFill style={ { fontFamily: fontSans } }>
            <style>{ `* { font-family: ${fontSans}, sans-serif; }` }</style>
            <Audio src={ staticFile("audio/demo30.wav") } />
            <Beat
                film={ DEMO30 }
                id="stakes"
                snap={ 0.03 }
            >
                <Demo30Stakes />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="wake"
                snap={ 0.03 }
            >
                <Demo30Wake />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="close"
                snap={ 0.02 }
            >
                <Demo30Close />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="portfolio"
            >
                <Demo30Portfolio />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="chain"
                snap={ 0.015 }
            >
                <Demo30Chain />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="call"
            >
                <CallScene
                    policyFrame={ DEMO30_POLICY_FRAME }
                    turns={ DEMO30_TURNS }
                />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="hardship"
            >
                <HardshipScene
                    enterFrame={ DEMO30_CASEY_ENTER_FRAME }
                    flagLine={ DEMO30_FLAG_LINE }
                    scoreFrames={ DEMO30_CASEY_SCORE_FRAMES }
                />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="benefit"
            >
                <Demo30Benefit />
            </Beat>
            <Beat
                film={ DEMO30 }
                id="lockup"
                snap={ 0.02 }
            >
                <LockupScene showStack={ false } />
            </Beat>
        </AbsoluteFill>
    );
}
