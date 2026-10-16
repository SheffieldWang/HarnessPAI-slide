import { Film } from '../src/film.js';
import { CREDITS, TAKEAWAYS } from '../src/credits.js';
import { WIDTH } from '../src/story.js';

const slides = globalThis.HARNESS_SLIDES;

export class SlideFrame extends Film {
  text(content, ...options) {
    const label = content === 'THE RESEARCH FILM' ? 'THE RESEARCH SLIDES' : content;
    if (this.textLayer) this.textLayer.draw(this.context, label, ...options);
    else super.text(label, ...options);
  }

  draw(time) {
    this.textLayer?.begin();
    const chapter = super.draw(time);
    this.textLayer?.end();
    return chapter;
  }

  eyebrow(number, content, vertical = 245) {
    this.text(String((this.slideIndex || 0) + 1).padStart(2, '0'), 100, vertical, 18, '#ff9454', 400, { mono: true });
    this.line(144, vertical - 6, 188, vertical - 6, '#bc7847');
    this.text(content, 208, vertical, 18, '#9fae92', 400, { tracking: 3 });
  }

  caption() {}

  chrome() {
    const index = this.slideIndex || 0;
    const slide = slides[index];
    this.panel(98, 54, 38, 38, { fill: '#ff9454', stroke: null, radius: 8 });
    this.text('H', 108, 82, 27, '#10150e', 800);
    this.text('HarnessPAI', 150, 83, 26, '#eeeede', 600, { tracking: -0.7 });
    this.line(337, 62, 337, 88, '#66724f');
    this.text('RESEARCH SLIDES', 362, 80, 13, '#9fae92', 400, { tracking: 2.2 });
    this.text(`${CREDITS.organization.toUpperCase()} / ${CREDITS.team.toUpperCase()}`, 1822, 79, 13, '#bcc5a9', 400, { align: 'right', tracking: 1.3 });
    this.line(98, 113, 1822, 113, '#82966635');
    this.text(slide.summary, WIDTH / 2, 933, 21, '#bdcda9', 400, { align: 'center' });
    this.line(98, 968, 1822, 968, '#82966640');
    this.text(`${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`, 100, 1008, 16, '#ff9454', 400, { mono: true });
    this.text(slide.section, 231, 1008, 14, '#b2bfa0', 400, { tracking: 1.5 });
    this.text('CONCEPT ILLUSTRATIONS · RESULTS REPORTED IN THE PAPER', 1822, 1008, 11, '#91a57c', 400, { mono: true, align: 'right' });
    slides.forEach((entry, position) => this.dot(WIDTH / 2 + (position - (slides.length - 1) / 2) * 22, 1047, position === index ? 4 : 2.5, position === index ? '#ff9454' : '#65774d'));
  }

  takeaways(time, localTime) {
    this.eyebrow('11', 'THREE IDEAS TO TAKE AWAY', 233);
    this.text('Better systems. Stronger physical intelligence.', 98, 327, 65, '#eeeede', 500, { tracking: -2 });
    TAKEAWAYS.forEach((takeaway, index) => {
      const horizontal = 100 + index * 582;
      const active = this.animate && Math.floor(localTime / 4) === index;
      this.panel(horizontal, 387, 556, 371, { fill: active ? '#3a2d1fed' : '#1b281bed', stroke: active ? '#ff9454' : '#8ca267', radius: 13 });
      this.text(String(index + 1).padStart(2, '0'), horizontal + 28, 447, 34, '#ff9454', 500, { mono: true });
      takeaway.title.forEach((line, lineIndex) => this.text(line, horizontal + 28, 505 + lineIndex * 40, 31, '#ffe1bf', 600));
      takeaway.detail.forEach((line, lineIndex) => this.text(line, horizontal + 28, 602 + lineIndex * 32, 23, '#b2c49c'));
      this.line(horizontal + 28, 695, horizontal + 528, 695, '#6b835044');
      this.text(takeaway.label, horizontal + 28, 730, 13, '#c1d2a5', 500, { mono: true, tracking: 0.4 });
    });
    this.creditsLine(822, 23);
    this.text(CREDITS.paperTitle, WIDTH / 2, 860, 20, '#95ab7c', 400, { align: 'center' });
  }
}
