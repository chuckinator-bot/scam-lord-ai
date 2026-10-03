/**
 * Prints composition id, beat id, and frame for one still per beat.
 * Intro beats are listed once, on RentRecoveryIntro.
 */

import { DEMO, INTRO, stillFrame, TEASER } from "../src/beats.ts";

const introIds = new Set(["late", "chase", "wake", "split", "brand"]);

for (const film of [INTRO, DEMO, TEASER]) {
    for (const beat of film.beats) {
        if (film.id !== "RentRecoveryIntro" && introIds.has(beat.id)) {
            continue;
        }
        console.log(`${film.id} ${beat.id} ${stillFrame(beat)}`);
    }
}
