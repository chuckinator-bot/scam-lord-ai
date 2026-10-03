# RentRecovery submission

Two-minute film. 30 fps, 1920×1080, 3600 frames. Assembly and guide share one timeline and one mix. The guide prop only burns in a slate, captions, and a clock.

`src/submission/narration.ts` is the spoken copy. `src/submission/timing.ts` is the clock. Guide captions and `captions/RentRecoverySubmission.srt` are generated from those two files.

## Sections

| | Section | In | Out |
| --- | --- | --- | --- |
| 1 | Stats | 0:00 | 0:16 |
| 2 | Old way | 0:16 | 0:33 |
| 3 | Ring | 0:33 | 0:43 |
| 4 | Live call | 0:43 | 1:26 |
| 5 | Home | 1:26 | 1:43 |
| 6 | Close | 1:43 | 2:00 |

The live-call slate reads `0:43–1:26 · 43s` until footage is dropped in.

## Re-time to the recorded read

The read wins over the table above.

1. Put the continuous take at `public/submission/vo.wav`, or one file per section at `public/submission/vo-01.wav` … `vo-06.wav`. A continuous take is used instead of the per-section files.
2. If a section's read starts late or early, change `startSec` / `endSec` in `src/submission/timing.ts`. Sections must stay back-to-back, start at 0, and end at or before 120.
3. For a small slip, set that section's entry in `VO_OFFSETS_SEC` (seconds after the section start). Leave the clock alone when the picture should stay put.
4. Re-run the render commands below. Captions move with the section start and the 2.5 words-per-second pace. If a read runs long, shorten the caption hold by editing the clock, not the words.

## Live-call footage

Drop `public/submission/call.mp4` (H.264, 30 fps constant frame rate, 1920×1080) or a separate `public/submission/call-audio.wav`. The picture goes in the phone on the left. `object-fit: cover` crops a vertical phone capture into that column.

Length: set the live-call `endSec` to `startSec` plus the footage duration in seconds. Shift Home and Close by the same amount. Keep the film at or under 120 seconds (3600 frames). Record about two extra seconds on each side of the slot.

Convert variable frame rate with:

```bash
ffmpeg -i capture.mov -vsync cfr -r 30 call.mp4
```

`showLiveCallsOverlay` draws the step chain and a transcript over the right-hand column. The assembly and the guide leave it off. A still with it on:

```bash
npx remotion still src/index.ts RentRecoverySubmission --frame=1740 --props='{"showLiveCallsOverlay":true}'
```

## Voice spec

WAV, 48 kHz, 24-bit, mono. One continuous take from 0:00 against the guide, no music. Peaks around -6 dBFS, a little room tone, no processing. Per-section files use the same spec.

## What the picture is allowed to say

On-screen stats, callouts, the close tagline, and the home tiles are the strings in `narration.ts` and `home-data.ts`. Home money is the sum of `scripts/seed-home-portfolio.ts` (recovered $10,660.00, still overdue $13,740.00, promised $9,110.00). Time to first call is an em dash: the seed's `minutes` field is resolution time, not time to first call. The product metrics band has six tiles with different labels. This film shows the four the narration names, in that tile chrome.

## Placeholder mix

Music ducks about 13.5 dB under every narration caption and under the whole live-call slot. The same duck applies when a voice file or call audio is present. The ring starts on "Nobody has time to make that call." and holds through the end of section 3.

Target for the rendered MP4: about -14 LUFS integrated, true peak at or under -1 dBTP.

## Music

Arpent by Kevin MacLeod. 120 BPM. Public domain dedication, December 2016, and CC0 1.0. No attribution required. Source mirror: https://github.com/0lhi/FreePD (stream/Electronic/Arpent.mp3). License: https://creativecommons.org/publicdomain/zero/1.0/. The 120 second cut is 60 bars of 4/4 and ends on a downbeat. See `public/submission/LICENSE-music.txt`.

## Render

From `remotion/`:

```bash
node scripts/detect-submission-assets.mjs
node --experimental-strip-types scripts/write-submission-srt.ts
npx remotion render src/index.ts RentRecoverySubmission --codec=h264 --audio-codec=aac --crf=18 --image-format=jpeg --jpeg-quality=90 --pixel-format=yuv420p --concurrency=2
npx remotion render src/index.ts RentRecoverySubmissionGuide --codec=h264 --audio-codec=aac --crf=18 --image-format=jpeg --jpeg-quality=90 --pixel-format=yuv420p --concurrency=2
```

Do not render the intro, the teaser, or either demo from this pass.

## Drop-in paths

| File | Role |
| --- | --- |
| `public/submission/vo.wav` | Continuous narration |
| `public/submission/vo-01.wav` … `vo-06.wav` | Per-section narration |
| `public/submission/call.mp4` | Live-call picture and, unless a separate wav is present, its audio |
| `public/submission/call-audio.wav` | Call audio. Mutes the picture's audio |
| `public/submission/music.mp3` | Bed |
| `public/submission/ring.wav` | Ring from "Nobody" through section 3 |
