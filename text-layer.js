const SANS = 'Arial, "Segoe UI", sans-serif';
const MONO = 'Consolas, "Liberation Mono", monospace';

export class TextLayer {
  constructor(container) {
    this.container = container;
    this.labels = [];
    this.baselines = new Map();
    this.cursor = 0;
  }

  baseline(font, size) {
    const key = `${font}/${size}`;
    if (!this.baselines.has(key)) {
      const probe = document.createElement('span');
      probe.style.cssText = `position:fixed;left:-10000px;top:0;visibility:hidden;white-space:pre;font:${font};line-height:${size}px;`;
      probe.append(document.createTextNode('Hg'));
      const marker = document.createElement('span');
      marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline;';
      probe.append(marker);
      document.body.append(probe);
      this.baselines.set(key, marker.getBoundingClientRect().top - probe.getBoundingClientRect().top);
      probe.remove();
    }
    return this.baselines.get(key);
  }

  begin() {
    this.cursor = 0;
  }

  draw(context, content, horizontal, vertical, size = 24, color = '#eeeede', weight = 400, options = {}) {
    let label = this.labels[this.cursor];
    if (!label) {
      label = document.createElement('span');
      label.className = 'slide-label';
      this.container.append(label);
      this.labels.push(label);
    }
    this.cursor++;
    const text = String(content);
    if (label.textContent !== text) label.textContent = text;
    const font = `${weight} ${size}px ${options.mono ? MONO : SANS}`;
    const top = vertical - this.baseline(font, size);
    const matrix = context.getTransform();
    const scaleHorizontal = context.canvas.width / 1920;
    const scaleVertical = context.canvas.height / 1080;
    const transform = [matrix.a / scaleHorizontal, matrix.b / scaleVertical, matrix.c / scaleHorizontal, matrix.d / scaleVertical, (matrix.a * horizontal + matrix.c * top + matrix.e) / scaleHorizontal, (matrix.b * horizontal + matrix.d * top + matrix.f) / scaleVertical];
    const align = options.align === 'center' ? '-50%' : options.align === 'right' ? '-100%' : '0';
    const style = `font:${font};line-height:${size}px;color:${color};letter-spacing:${options.tracking || 0}px;opacity:${context.globalAlpha};transform:matrix(${transform.join(',')}) translateX(${align});`;
    if (label.dataset.style !== style) {
      label.style.cssText = style;
      label.dataset.style = style;
    }
    label.hidden = context.globalAlpha < 0.01;
  }

  end() {
    for (let index = this.cursor; index < this.labels.length; index++) this.labels[index].hidden = true;
  }
}
