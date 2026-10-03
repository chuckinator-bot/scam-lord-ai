#!/usr/bin/env bash
# Intro soundtrack only. Tones are synthesized with SoX (original, unlicensed).
# Voice is a local Piper clip at public/audio/voice.wav (en_US lessac medium).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUDIO="$ROOT/public/audio"
mkdir -p "$AUDIO"

if [[ ! -f "$AUDIO/voice.wav" ]]; then
    echo "Missing $AUDIO/voice.wav" >&2
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

VOICE_DUR="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$AUDIO/voice.wav")"
FADE_START="$(awk -v duration="$VOICE_DUR" 'BEGIN { printf "%.3f", duration - 0.167 }')"
ffmpeg -y -hide_banner -loglevel error \
    -i "$AUDIO/voice.wav" \
    -af "afade=t=out:st=${FADE_START}:d=0.167" \
    "$TMP/voice.wav"

read -r INTRO_SEC DEMO_SEC TEASER_SEC < <(node --experimental-strip-types -e '
import { DEMO, INTRO, TEASER, FPS } from "./src/beats.ts";
const seconds = (frames) => (frames / FPS).toFixed(3);
process.stdout.write(`${seconds(INTRO.durationInFrames)} ${seconds(DEMO.durationInFrames)} ${seconds(TEASER.durationInFrames)}\n`);
')

ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -t "$INTRO_SEC" -i anullsrc=r=48000:cl=mono \
    -i "$TMP/notify.wav" \
    -i "$TMP/ring.wav" \
    -i "$TMP/voice.wav" \
    -i "$TMP/success.wav" \
    -filter_complex "\
[1]adelay=520|520,volume=0.95[n];\
[2]adelay=2050|2050,volume=0.78[r];\
[3]adelay=1050|1050,volume=0.95[v];\
[4]adelay=7280|7280,volume=0.92[s];\
[0][n][r][v][s]amix=inputs=5:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.95" \
    "$AUDIO/intro.wav"

ffmpeg -y -hide_banner -loglevel error -i "$AUDIO/intro.wav" -af "apad=pad_dur=60" -t "$DEMO_SEC" "$AUDIO/demo.wav"
ffmpeg -y -hide_banner -loglevel error -i "$AUDIO/intro.wav" -af "apad=pad_dur=20" -t "$TEASER_SEC" "$AUDIO/teaser.wav"

echo "Wrote intro.wav, demo.wav, teaser.wav"
