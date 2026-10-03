/**
 * @module remotion/Films
 * RentRecoveryIntro, RentRecoveryDemo, and RentRecoveryTeaser.
 * Depends on: beats, scenes, chrome.
 * Used by: Root.
 */

import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { beatById, DEMO, INTRO, TEASER, type IFilm } from "./beats";
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
            { beat.caption ? <Caption text={ beat.caption } /> : null }
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
        <AbsoluteFill>
            <Audio src={ staticFile("audio/intro.wav") } />
            <IntroBeats />
        </AbsoluteFill>
    );
}

export function DemoFilm() {
    return (
        <AbsoluteFill>
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
        <AbsoluteFill>
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
