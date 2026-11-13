#!/bin/zsh
# Renders an HTML artboard to a 1:1 PNG with headless Chrome.
# Usage: ./shot.sh <input.html> <output.png> [width] [height] [transparent]
set -e

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
IN="$1"
OUT="$2"
W="${3:-1080}"
H="${4:-1920}"
BG=""
[[ "$5" == "transparent" ]] && BG="--default-background-color=00000000"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --no-sandbox \
  --force-device-scale-factor=1 \
  --allow-file-access-from-files \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=4000 \
  $BG \
  --window-size="${W},${H}" \
  --screenshot="${OUT}" \
  "file://${IN}" >/dev/null 2>&1

sips -g pixelWidth -g pixelHeight "$OUT" | tail -2
