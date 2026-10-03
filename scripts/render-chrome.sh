#!/bin/sh
# Keep Chromium's screenshot compositor on the CPU: GPU rasterization can
# intermittently repeat tiles of the canvas in an otherwise valid video frame.
exec "${ART_HISTORY_CHROME_BINARY:?Missing Chrome executable}" \
  --disable-gpu --disable-gpu-rasterization --disable-accelerated-2d-canvas "$@"
