import { SlideFrame } from './slide-scene.js';
import { TextLayer } from './text-layer.js';
import { CREDITS } from '../src/credits.js';

export async function createLiveStage(canvas, layer) {
  await document.fonts.ready;
  const institutions = [CREDITS.organization, ...CREDITS.collaborators];
  const entries = globalThis.HARNESS_LOGOS;
  if (!Array.isArray(entries) || entries.length !== institutions.length || entries.some((entry, index) => entry.institution !== institutions[index])) {
    throw new Error('Logo data does not match the credits. Rebuild with npm run slides:build.');
  }
  const logos = new Map(await Promise.all(entries.map(async (entry) => {
    if (!/^[a-z-]+\.png$/.test(entry.file)) throw new Error('Invalid logo asset.');
    const image = new Image();
    image.src = `logos/${entry.file}`;
    try { await image.decode(); }
    catch { throw new Error(`Cannot load ${entry.institution}. Keep the logos folder next to index.html.`); }
    return [entry.institution, image];
  })));
  const width = innerWidth < 700 ? 1280 : 1920;
  const frame = new SlideFrame(canvas, { width, height: width * 9 / 16, logos });
  frame.textLayer = new TextLayer(layer);
  frame.animate = true;
  return {
    render(index, elapsed) {
      const slide = globalThis.HARNESS_SLIDES[index];
      const span = slide.animation.end - slide.animation.start;
      const position = elapsed % (span + 1.6);
      frame.slideIndex = index;
      frame.draw(slide.animation.start + Math.min(span, position));
    },
    onContextLost(handler) {
      frame.stage.renderer.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); handler(); });
    }
  };
}
