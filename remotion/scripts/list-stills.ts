/**
 * Prints composition id, beat id, and frame for one still per beat.
 * Intro beats are listed once, on RentRecoveryIntro.
 */

import { beatById, DEMO, HARDSHIP_CASEY_CAPTION_FRAME, INTRO, stillFrame, TEASER } from "../src/beats.ts";

const introIds = new Set(["late", "chase", "wake", "split", "brand"]);

for (const film of [INTRO, DEMO, TEASER]) {
    for (const beat of film.beats) {
        if (film.id !== "RentRecoveryIntro" && introIds.has(beat.id)) {
            continue;
        }
        console.log(`${film.id} ${beat.id} ${stillFrame(beat)}`);
    }
}

const hardship = beatById(DEMO, "hardship");
console.log(`RentRecoveryDemo hardship-john ${hardship.from + 90}`);
console.log(`RentRecoveryDemo hardship-casey ${hardship.from + HARDSHIP_CASEY_CAPTION_FRAME + 72}`);
