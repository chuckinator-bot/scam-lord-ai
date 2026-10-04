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

node --experimental-strip-types scripts/list-stills.ts > /tmp/rentrecovery-stills.txt
while read -r id beat frame; do
    seconds="$(awk -v frame="$frame" 'BEGIN { printf "%.3f", frame / 30 }')"
    ffmpeg -nostdin -y -hide_banner -loglevel error -i "$OUT/${id}.mp4" -ss "$seconds" -frames:v 1 "$OUT/${id}-${beat}.png"
    echo "still $id $beat @ ${seconds}s"
done < /tmp/rentrecovery-stills.txt

ffmpeg -nostdin -y -hide_banner -loglevel error \
    -i "$OUT/RentRecoveryIntro.mp4" -ss 7.500 -frames:v 1 \
    "$OUT/RentRecoveryIntro-swap.png"
echo "still RentRecoveryIntro swap @ 7.500s"

ffmpeg -nostdin -y -hide_banner -loglevel error \
    -i "$OUT/RentRecoveryIntro.mp4" -ss 0.500 -frames:v 1 \
    "$OUT/RentRecoveryIntro-0.5s.png"
echo "still RentRecoveryIntro alarm @ 0.500s"

ffmpeg -nostdin -y -hide_banner -loglevel error \
    -i "$OUT/RentRecoveryIntro.mp4" -ss 8.500 -frames:v 1 \
    "$OUT/RentRecoveryIntro-held.png"
echo "still RentRecoveryIntro held @ 8.500s"

ffmpeg -nostdin -y -hide_banner -loglevel error \
    -i "$OUT/RentRecoveryDemo.mp4" -ss 13.000 -frames:v 1 \
    "$OUT/RentRecoveryDemo-portfolio-13s.png"
echo "still RentRecoveryDemo portfolio @ 13.000s"

ffmpeg -nostdin -y -hide_banner -loglevel error \
    -i "$OUT/RentRecoveryDemo.mp4" -ss 16.000 -frames:v 1 \
    "$OUT/RentRecoveryDemo-portfolio-16s.png"
echo "still RentRecoveryDemo portfolio @ 16.000s"

ffmpeg -nostdin -y -hide_banner -loglevel error \
    -i "$OUT/RentRecoveryDemo.mp4" -ss 26.000 -frames:v 1 \
    "$OUT/RentRecoveryDemo-chain.png"
echo "still RentRecoveryDemo chain @ 26.000s"
cp "$OUT/RentRecoveryDemo-pay.png" "$OUT/RentRecoveryDemo-checkout.png"
echo "still RentRecoveryDemo checkout"
