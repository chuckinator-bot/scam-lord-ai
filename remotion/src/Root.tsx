/**
 * @module remotion/Root
 * Registers the three compositions.
 * Depends on: Films, beats.
 * Used by: index.
 */

import { Composition } from "remotion";
import { DEMO, FPS, HEIGHT, INTRO, TEASER, WIDTH } from "./beats";
import { DemoFilm, IntroFilm, TeaserFilm } from "./Films";

export function RemotionRoot() {
    return (
        <>
            <Composition
                component={ DemoFilm }
                durationInFrames={ DEMO.durationInFrames }
                fps={ FPS }
                height={ HEIGHT }
                id="RentRecoveryDemo"
                width={ WIDTH }
            />
            <Composition
                component={ IntroFilm }
                durationInFrames={ INTRO.durationInFrames }
                fps={ FPS }
                height={ HEIGHT }
                id="RentRecoveryIntro"
                width={ WIDTH }
            />
            <Composition
                component={ TeaserFilm }
                durationInFrames={ TEASER.durationInFrames }
                fps={ FPS }
                height={ HEIGHT }
                id="RentRecoveryTeaser"
                width={ WIDTH }
            />
        </>
    );
}
