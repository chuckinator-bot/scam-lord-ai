/**
 * @module remotion/Root
 * Registers the RentRecovery compositions.
 * Depends on: Films, beats.
 * Used by: index.
 */

import { Composition } from "remotion";
import { DEMO, DEMO30, FPS, HEIGHT, INTRO, TEASER, WIDTH } from "./beats";
import { Demo30Film, DemoFilm, IntroFilm, TeaserFilm } from "./Films";

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
            <Composition
                component={ Demo30Film }
                durationInFrames={ DEMO30.durationInFrames }
                fps={ FPS }
                height={ HEIGHT }
                id="RentRecoveryDemo30"
                width={ WIDTH }
            />
        </>
    );
}
