# HarnessPAI — Live, Silent Research Slides

Clone or download this repository and open `index.html` in a WebGL 2-capable browser. If you have the separately distributed `HarnessPAI-Live-Slides.zip`, extract it first. Keep the files and folders together. Three.js and the logos are bundled locally, so no build step, server, internet connection, or audio files are required. WebGL 2 is required for the live robot scenes.

## Navigation

- Use the Previous / Next buttons, the arrow keys, Page Up / Page Down, or Space / Shift+Space.
- Home goes to the cover; End goes to the takeaways.
- O opens the slide overview; Escape closes it.
- F toggles full screen. On mobile, swipe horizontally or rotate to landscape for a larger view.
- P pauses or resumes the animation; R replays the current page. Animations loop within the page; they never turn the page automatically.
- Drag across titles, descriptions, numbers, or diagram labels to select and copy them. Animation holds while you select text. “Copy text” copies all visible slide text.
- A URL ending in `#slide-8` opens slide 8 directly. Browser Back / Forward restores previous slides.

There is no narration, music, video playback, or audio initialization. Three.js renders the moving robots; Canvas draws the diagram shapes and panels; a separate HTML layer contains the selectable text. Images are used only for overview thumbnails and the supplied logos, not as the presentation surface. Pages use page numbers and a fixed key message rather than the film timeline and timed captions.

Animation pauses while the overview is open or the browser tab is hidden. A system preference for reduced motion starts the presentation paused; “Play animation” enables it. Swiping over a text label does not turn the page, so selecting text on touch screens remains possible.

## Content

Eleven pages retain the paper title, original Xiaomi and institution logos, the technical story, benchmark results, and the final three takeaways. The two-timescale and task-memory chapters each become two slides so both diagram states remain understandable without animation.

Added text is English. Original logos retain their supplied lettering, including Chinese where present. Lettering embedded inside a logo remains part of that image; the accompanying English institution name is selectable. Robot scenes are conceptual illustrations, not experimental footage. Reported harness gains and the separate fine-tuning result remain distinct.

## Rebuilding from the source repository

This repository contains the ready-to-view presentation, including the prebuilt `runtime.js`. The unbundled JavaScript modules and thumbnail renderer reference shared film sources in `../src/`, which are part of the original paper repository and are not included here. Rebuilding requires that original source tree; viewing or hosting this presentation does not.

In the original source tree, run `npm run slides:build` from `promo/`. This bundles the live Three.js scene and HTML text renderer, refreshes the overview thumbnails, and writes `output/live-slides/HarnessPAI-Live-Slides.zip`. Node.js, esbuild, Playwright Chromium, and Python 3 are needed only for rebuilding. The original film and its audio are unchanged; the earlier static ZIP remains at `output/slides/HarnessPAI-Slides.zip`.
