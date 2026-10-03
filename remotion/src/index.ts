/**
 * @module remotion/index
 * Remotion entry. Waits for Archivo before the first frame.
 * Depends on: fonts, Root.
 * Used by: the Remotion CLI.
 */

import { continueRender, delayRender, registerRoot } from "remotion";
import { waitForFonts } from "./fonts";
import { RemotionRoot } from "./Root";

const fontHandle = delayRender("Archivo");
waitForFonts()
    .then(() => {
        continueRender(fontHandle);
    })
    .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Font load failed";
        continueRender(fontHandle);
        throw new Error(message);
    });

registerRoot(RemotionRoot);
