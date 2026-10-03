/**
 * @module remotion/Films
 * RentRecoveryIntro, RentRecoveryDemo, and RentRecoveryTeaser.
 * Depends on: beats, scenes, chrome.
 * Used by: Root.
 */

import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { beatById, DEMO, INTRO, TEASER, type IBeat, type IFilm } from "./beats";
import { fontSans } from "./fonts";
import { Caption, Snap } from "./components/chrome";
import { BrandBeat, ChaseBeat, LateBeat, SplitBeat, WakeBeat } from "./scenes/intro";
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

function IntroBeats() {
    return (
        <>
            <Beat
                film={ INTRO }
                id="late"
            >
                <LateBeat />
            </Beat>
            <Beat
                film={ INTRO }
                id="chase"
            >
                <ChaseBeat />
            </Beat>
            <Beat
                film={ INTRO }
                id="wake"
                snap={ 0.03 }
            >
                <WakeBeat />
            </Beat>
            <Beat
                film={ INTRO }
                id="split"
            >
                <SplitBeat />
            </Beat>
            <Beat
                film={ INTRO }
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
            <Audio src={ staticFile("audio/intro.wav") } />
            <IntroBeats />
        </AbsoluteFill>
    );
}

export function DemoFilm() {
    return (
        <AbsoluteFill style={ { fontFamily: fontSans } }>
            <style>{ `* { font-family: ${fontSans}, sans-serif; }` }</style>
            <Audio src={ staticFile("audio/demo.wav") } />
            <IntroBeats />
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
            <IntroBeats />
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
