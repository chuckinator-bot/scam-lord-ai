#!/usr/bin/env bash
# v7 soundtrack. Does not overwrite intro.wav, demo.wav, teaser.wav, or voice.wav.
# Voice is public/audio/voice-sunset.wav (en_US lessac medium, length_scale 1.0).
# Acoustic energy on that clip lasts through 3.96s. Whisper's "Properties" end is early.
# The 5-frame fade starts at 4.000s and finishes at 4.167s, before either chime.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUDIO="$ROOT/public/audio"
mkdir -p "$AUDIO"

if [[ ! -f "$AUDIO/voice-sunset.wav" ]]; then
    echo "Missing $AUDIO/voice-sunset.wav" >&2
    exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

sox -n -r 48000 -c 1 "$TMP/n1.wav" synth 0.09 sine 880 gain -5 fade 0.004 0.09 0.03
sox -n -r 48000 -c 1 "$TMP/n2.wav" synth 0.13 sine 1318 gain -4 fade 0.004 0.13 0.05
sox -n -r 48000 -c 1 "$TMP/ng.wav" trim 0 0.05
sox "$TMP/n1.wav" "$TMP/ng.wav" "$TMP/n2.wav" "$TMP/notify.wav"

sox -n -r 48000 -c 1 "$TMP/toneA.wav" synth 0.38 sine 440 gain -8
sox -n -r 48000 -c 1 "$TMP/toneB.wav" synth 0.38 sine 480 gain -8
sox -m "$TMP/toneA.wav" "$TMP/toneB.wav" "$TMP/burst.wav" fade 0.012 0.38 0.04
sox -n -r 48000 -c 1 "$TMP/rg.wav" trim 0 0.14
sox "$TMP/burst.wav" "$TMP/rg.wav" "$TMP/burst.wav" "$TMP/ring.wav"

sox -n -r 48000 -c 1 "$TMP/s1.wav" synth 0.16 sine 523.25 gain -7 fade 0.005 0.16 0.10
sox -n -r 48000 -c 1 "$TMP/s2.wav" synth 0.16 sine 659.25 gain -7 fade 0.005 0.16 0.10
sox -n -r 48000 -c 1 "$TMP/s3.wav" synth 0.18 sine 783.99 gain -6 fade 0.005 0.18 0.12
sox -n -r 48000 -c 1 "$TMP/s4.wav" synth 0.36 sine 1046.50 gain -5 fade 0.005 0.36 0.22
ffmpeg -y -hide_banner -loglevel error \
    -i "$TMP/s1.wav" -i "$TMP/s2.wav" -i "$TMP/s3.wav" -i "$TMP/s4.wav" \
    -filter_complex "[1]adelay=70|70[b];[2]adelay=140|140[c];[3]adelay=210|210[d];[0][b][c][d]amix=inputs=4:duration=longest:normalize=0" \
    "$TMP/success.wav"

SPEECH_END="3.960"
FADE_START="$(awk -v end="$SPEECH_END" 'BEGIN { printf "%.3f", end + 0.040 }')"
TAIL="$(awk -v start="$FADE_START" 'BEGIN { printf "%.3f", start + 0.167 }')"
ffmpeg -y -hide_banner -loglevel error \
    -i "$AUDIO/voice-sunset.wav" \
    -af "aresample=48000,atrim=end=${TAIL},afade=t=out:st=${FADE_START}:d=0.167" \
    "$TMP/voice.wav"

read -r INTRO_SEC DEMO30_SEC < <(node --experimental-strip-types -e '
import { DEMO30, INTRO, FPS } from "./src/beats.ts";
const seconds = (frames) => (frames / FPS).toFixed(3);
process.stdout.write(`${seconds(INTRO.durationInFrames)} ${seconds(DEMO30.durationInFrames)}\n`);
')

# 11s intro. Voice starts as the wake card arrives (ring ends at 2.95s).
# Fade ends at 7.267s. Chime at 7.450s, inside the split card, before the brand card.
ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -t "$INTRO_SEC" -i anullsrc=r=48000:cl=mono \
    -i "$TMP/notify.wav" \
    -i "$TMP/ring.wav" \
    -i "$TMP/voice.wav" \
    -i "$TMP/success.wav" \
    -filter_complex "\
[1]adelay=520|520,volume=0.95[n];\
[2]adelay=2050|2050,volume=0.78[r];\
[3]adelay=3100|3100,volume=0.95[v];\
[4]adelay=7450|7450,volume=0.92[s];\
[0][n][r][v][s]amix=inputs=5:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.95" \
    "$AUDIO/intro-v7.wav"

# 30s film. Tighter bed so the chime ends inside the 7.2s intro beat.
# Voice delay 1.780s. Fade ends at 5.947s. Chime at 6.120s, ends near 6.69s.
ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -t "$DEMO30_SEC" -i anullsrc=r=48000:cl=mono \
    -i "$TMP/notify.wav" \
    -i "$TMP/ring.wav" \
    -i "$TMP/voice.wav" \
    -i "$TMP/success.wav" \
    -filter_complex "\
[1]adelay=280|280,volume=0.95[n];\
[2]adelay=720|720,volume=0.78[r];\
[3]adelay=1780|1780,volume=0.95[v];\
[4]adelay=6120|6120,volume=0.92[s];\
[0][n][r][v][s]amix=inputs=5:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.95" \
    "$AUDIO/demo30.wav"

echo "Wrote intro-v7.wav (${INTRO_SEC}s) and demo30.wav (${DEMO30_SEC}s)"
