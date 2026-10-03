#!/usr/bin/env bash
# Renders the three films, then stills and captions.
# Order: demo, intro, teaser.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-/opt/cursor/artifacts}"
cd "$ROOT"
mkdir -p "$OUT" "$ROOT/captions"

bash scripts/build-audio.sh

render_one() {
    local id="$1"
    npx remotion render src/index.ts "$id" "$OUT/${id}.mp4" \
        --codec=h264 \
        --audio-codec=aac \
        --crf=18 \
        --image-format=jpeg \
        --jpeg-quality=90 \
        --pixel-format=yuv420p \
        --concurrency=3
}

render_one RentRecoveryDemo
render_one RentRecoveryIntro
render_one RentRecoveryTeaser

node --experimental-strip-types scripts/write-srts.ts "$OUT"

node --experimental-strip-types scripts/list-stills.ts | while read -r id beat frame; do
    seconds="$(awk -v frame="$frame" 'BEGIN { printf "%.3f", frame / 30 }')"
    ffmpeg -y -hide_banner -loglevel error -i "$OUT/${id}.mp4" -ss "$seconds" -frames:v 1 "$OUT/${id}-${beat}.png"
    echo "still $id $beat @ ${seconds}s"
done
