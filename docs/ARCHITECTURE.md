# Architecture

The application has three entry points: Vite loads `src/main.tsx`, Remotion loads `src/video/Root.tsx`, and the exporter runs `scripts/render.mjs`. They share the same drawing code and timeline.

## Web interface

`App.tsx` composes the page layout, introduction, and film experience. `components/` contains page chrome and shared icons. `features/film/` owns the preview, era navigation, actions, and their hooks.

`useFilmPlayback` owns the player ref, frame notifications, bounded seeking, and replay. Captions update ten times a second; the canvas continues to render at the composition frame rate. `useFilmDownload` owns MP4 availability: it checks the response status and media type, waits for each request to finish before polling again, and cancels work on unmount. Download polling only updates the actions component.

Components retain native controls, explicit labels, keyboard focus, and the paused initial state. Appearance is defined by the existing CSS tokens in `styles.css`; rendering geometry uses the separate `ART` coordinate space.

## Animation and drawing

`timeline.json` is the source of video dimensions, frame rate, era boundaries, transition settings, and synchronized cat/cup events. `timeline.ts` exposes the application-facing data and helpers. `animation/` contains pure interpolation, timing, blinking, cat motion, cup motion, and arm geometry. These calculations do not import Canvas or React. The still exporter also imports the timing policy directly; Node 22.19 or newer supports the TypeScript used by that module.

Each frame follows this pipeline:

1. `art/render.ts` converts the frame to time and determines the active era or transition.
2. `art/scene.ts` draws the static room, moving environment, actors, reflections, and atmosphere in order.
3. `art/media.ts` applies the era's mosaic, brush, pixel, or vignette treatment.
4. `art/transitions.ts` blends two live scenes. Lettering fades separately and dates interpolate continuously.
5. `art/canvas.ts` presents the completed frame at native resolution or scales it to the target canvas.

`createArtRenderer()` owns reusable outgoing and incoming buffers for one composition instance. `ArtHistory.tsx` retains that renderer for its lifetime; `renderArt()` is the convenience renderer used by standalone frame checks. Every frame resets the Canvas context, including clipping and filters. Native output copies pixel data directly to avoid GPU resampling artifacts.

Historical people and cats live in `art/historical/`. `art/geometricHuman.ts`, `cup.ts`, `painted.ts`, `retro3d.ts`, and `styledCats.ts` handle other drawing styles. `art/actors.ts` shares placement transforms and selects the appropriate drawing implementation.

The contemporary scene is assembled by `art/modern/index.ts`. Its room, moving environment, person, cat, and cup are independent modules. They share the palette and seeded printed-paper treatment in `modern/materials.ts`.

Static details and textures are cached. Moving geometry is redrawn from absolute time, never advanced from the previous frame. Rendering a frame must give the same result in any order. Keep seeded random calls and drawing order stable when refactoring detailed artwork.

## Export and verification

`scripts/render.mjs` selects a full film, stills, or transition probe. `scripts/lib/render-session.mjs` owns bundling, browser startup, composition selection, and cleanup. `render-film.mjs` shares encoding settings with the probe, captures lossless PNG frames for H.264 encoding, and validates the MP4 before copying it to `public/`; `render-stills.mjs` exports era/action samples and creates the storyboard.

Exports use the Chrome Headless Shell version tested with the pinned Remotion renderer on every platform, downloaded and cached by Remotion. They do not depend on updates to the desktop Chrome installation. Browser verification can still use installed macOS Chrome or Playwright's Chromium. Retain encoded-frame verification when upgrading Remotion; source-level frame checks cannot detect screenshot/compositor failures.

`scripts/verify.mjs` orchestrates interface, animation, responsive, download, and finished-video checks from `scripts/checks/`. `verify-production.mjs` checks the built site at its GitHub Pages base path. Both use `scripts/lib/preview.mjs`, which owns and cleans up their isolated Vite server and Playwright browser, including on failure.

Run `npm run check` for formatting, lint, types, and build. Run `npm run check:preview` for source/browser checks, `npm run check:production` for the built site, and `npm run render` followed by `npm run check:video` to validate a new film. See [Contributing](../CONTRIBUTING.md) for change-specific requirements.

## Extension boundaries

- Change timing or synchronized events in `timeline.json`; avoid a second clock in a drawing module.
- Change motion in `animation/`; change appearance in the corresponding drawing layer.
- Add room layers through `art/scene.ts` and actor selection through `art/actors.ts`.
- Load public files through `publicAsset()` so development, production, and Remotion export resolve the same assets.
- Keep generated films, audio, captures, and build output out of Git.
