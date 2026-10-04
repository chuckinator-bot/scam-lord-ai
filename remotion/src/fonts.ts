/**
 * @module remotion/fonts
 * Archivo Black for headlines and the wordmark. Archivo for everything else.
 * Depends on: @remotion/google-fonts.
 * Used by: Root, scenes.
 */

import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadArchivoBlack } from "@remotion/google-fonts/ArchivoBlack";

const sans = loadArchivo("normal", {
    subsets: ["latin"],
    weights: ["400", "600"],
});

const display = loadArchivoBlack("normal", {
    subsets: ["latin"],
    weights: ["400"],
});

export const fontSans = sans.fontFamily;
export const fontDisplay = display.fontFamily;

export function waitForFonts(): Promise<void> {
    return Promise.all([sans.waitUntilDone(), display.waitUntilDone()]).then(() => undefined);
}
