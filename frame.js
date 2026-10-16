import { SlideFrame } from './slide-scene.js';
import { loadCreditLogos } from '../src/logos.js';

const slides = globalThis.HARNESS_SLIDES;

try {
  await document.fonts.ready;
  const logos = await loadCreditLogos();
  const canvas = document.getElementById('slide');
  const frame = new SlideFrame(canvas, { width: 1920, height: 1080, logos });
  window.harnessSlidesRender = {
    ready: true,
    render(index) {
      if (!Number.isInteger(index) || index < 0 || index >= slides.length) throw new Error('Invalid slide index.');
      frame.slideIndex = index;
      frame.draw(slides[index].time);
      return canvas.toDataURL('image/jpeg', 0.96).split(',')[1];
    }
  };
} catch (error) {
  window.harnessSlidesRender = { ready: false, error: error.message };
}
