/**
 * @module remotion/hype30/Film
 * RentRecoveryHype30. Music only. Captions are part of the picture.
 * Depends on: chrome, hype30/beats, hype30/scenes.
 * Used by: Root.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Caption } from "../components/chrome";
import { fontSans } from "../fonts";
import { theme } from "../theme";
import { HYPE_BEATS } from "./beats";
import { HypeScene } from "./scenes";

export function Hype30Film() {
    return (
        <AbsoluteFill style={ { background: theme.bg, fontFamily: fontSans } }>
            <Audio
                src={ staticFile("hype30/music.mp3") }
                volume={ 1 }
            />
            { HYPE_BEATS.map((beat) => (
                <Sequence
                    durationInFrames={ beat.durationInFrames }
                    from={ beat.from }
                    key={ beat.id }
                >
                    <HypeScene id={ beat.id } />
                    <Caption text={ beat.caption } />
                </Sequence>
            )) }
        </AbsoluteFill>
    );
}
