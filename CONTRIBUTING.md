# Contributing

Use Node 22, Python 3.12, and FFmpeg. Install with `npm ci` and `python3 -m pip install -r requirements.txt`, then run `npm run audio` before starting the app or browser checks. See [README](README.md) for setup and export commands.

Keep changes focused. Run `npm run format` and `npm run check` before opening a pull request. Run `npm run check:preview` after changing animation, fonts, controls, accessibility, asset paths, or responsive layout. Install Chromium with `npx playwright install chromium` if Google Chrome is not available on macOS. CI runs both fast and browser checks.

Preserve one shared clock in `src/timeline.json`, deterministic seeded textures, continuous cat motion, and frame-order-independent rendering. Keep drawing coordinates in the shared `ART` space and derive export dimensions from `VIDEO`. Cache static details and redraw moving geometry. Use shared CSS tokens and native, labeled controls. Keep playback paused until the user starts it, maintain focus visibility, and respect reduced motion in the interface.

Prettier formats TypeScript, JavaScript, JSON, CSS, HTML, Markdown, and workflow YAML. ESLint checks code and React Hooks; TypeScript checks strict types. Python scripts use four-space indentation. Existing font license files are excluded from formatting.

For visible changes, describe the resulting behavior and inspect desktop, tablet, and mobile views. For timing, character, or soundtrack changes, run `npm run render` and `npm run check:video`. Include useful validation evidence in the pull request, without committing temporary captures, old exports, or generated audio/video.

Use `publicAsset()` for files served by both Vite and Remotion, and `%BASE_URL%` for public assets in `index.html`. Production preview uses `/cat-through-time/`; check this path as well as the development root when changing asset loading.

Project code is MIT licensed. Add the source and original license of any new third-party asset to [Third-party licenses](docs/THIRD_PARTY_LICENSES.md), and retain required notices. Report sensitive issues according to [SECURITY](SECURITY.md).

For production asset or hosting changes, run `npm run build` followed by `npm run check:production`. Pages deploys the exact commit from a successful CI push to `main` and renders media during deployment; never commit those generated files.
