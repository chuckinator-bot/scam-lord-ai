/**
 * @module remotion/submission/asset-flags
 * Which drop-in files are on disk. scripts/detect-submission-assets.mjs
 * rewrites the booleans before a render. Defaults are the placeholder mix.
 * Depends on: none.
 * Used by: Film.
 */

export interface IAssetFlags {
    readonly hasCall: boolean;
    readonly hasCallAudio: boolean;
    readonly hasVo: boolean;
    readonly sectionVo: readonly boolean[];
}

export const ASSET_FLAGS: IAssetFlags = {
    hasCall: false,
    hasCallAudio: false,
    hasVo: false,
    sectionVo: [false, false, false, false, false, false],
};
