import { createLiveStage } from './live-stage.js';

(() => {
  'use strict';

  const slides = globalThis.HARNESS_SLIDES;
  const element = (identifier) => document.getElementById(identifier);
  const textLayer = element('slide-text');
  const surface = element('slide-surface');
  const overview = element('overview');
  const choices = [];
  let current = -1;
  let touchStart;
  let stage;
  let elapsed = 0;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let selecting = false;
  let selectionHeld = false;
  let previousTime = performance.now();
  let lastDraw = 0;
  let fatalError = false;

  const imagePath = (index) => `images/slide-${String(index + 1).padStart(2, '0')}.jpg`;
  const boundedIndex = (index) => Math.min(slides.length - 1, Math.max(0, Number.isFinite(index) ? Math.trunc(index) : 0));
  const hashIndex = () => boundedIndex(Number(/^#slide-(\d+)$/.exec(location.hash)?.[1] || 1) - 1);
  const report = (message) => { element('status').textContent = message; };
  const help = '← → to navigate · P to pause · R to replay · Drag text to select';

  function updateAnimationButton() {
    element('animation-toggle').textContent = paused ? 'Play animation' : 'Pause animation';
    element('animation-toggle').setAttribute('aria-pressed', String(paused));
  }

  function clearSlideSelection() {
    if (textLayer.contains(getSelection()?.anchorNode)) getSelection().removeAllRanges();
    selecting = false;
    selectionHeld = false;
  }

  function drawCurrent() {
    if (stage && !fatalError) stage.render(current, elapsed);
  }

  function toggleAnimation() {
    if (!stage || fatalError) return;
    paused = !paused;
    if (!paused) clearSlideSelection();
    updateAnimationButton();
    report(paused ? 'Animation paused. Text remains selectable.' : help);
  }

  function replayAnimation() {
    if (!stage || fatalError) return;
    clearSlideSelection();
    elapsed = 0;
    paused = false;
    drawCurrent();
    updateAnimationButton();
    report(help);
  }

  function tick(now) {
    const delta = Math.min((now - previousTime) / 1000, 0.25);
    previousTime = now;
    if (stage && !fatalError && !paused && !selecting && !selectionHeld && !document.hidden && !overview.open) {
      elapsed += delta;
      if (now - lastDraw >= 1000 / 30) {
        drawCurrent();
        lastDraw = now;
      }
    }
    requestAnimationFrame(tick);
  }

  function showSlide(index) {
    current = boundedIndex(index);
    const slide = slides[current];
    clearSlideSelection();
    elapsed = paused ? Math.max(0, slide.time - slide.animation.start) : 0;
    textLayer.setAttribute('aria-label', `${slide.title}. ${slide.description}`);
    drawCurrent();
    element('slide-title').textContent = slide.title;
    element('slide-section').textContent = slide.section;
    element('slide-summary').textContent = slide.summary;
    element('page-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    element('previous').disabled = current === 0;
    element('next').disabled = current === slides.length - 1;
    choices.forEach((choice, position) => choice.setAttribute('aria-current', String(position === current)));
    document.title = `${slide.title} — ${current + 1}/${slides.length} · HarnessPAI Slides`;
    report(help);
  }

  function goTo(index, replace = false) {
    const target = boundedIndex(index);
    const hash = `#slide-${target + 1}`;
    if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null, '', hash);
    if (target !== current) showSlide(target);
  }

  function openOverview() {
    if (overview.open) return;
    overview.showModal();
    choices[current].focus();
    choices[current].scrollIntoView({ block: 'nearest' });
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else report('Use your browser’s full-screen mode or rotate your device to landscape.');
    } catch {
      report('Full screen is unavailable here. Use your browser’s full-screen mode.');
    }
  }

  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'slide-choice';
    button.setAttribute('aria-label', `Slide ${index + 1}: ${slide.title}`);
    const thumbnail = document.createElement('img');
    thumbnail.src = imagePath(index);
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    thumbnail.width = 1920;
    thumbnail.height = 1080;
    const number = document.createElement('span');
    number.className = 'choice-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('span');
    title.className = 'choice-title';
    title.textContent = slide.title;
    button.append(thumbnail, number, title);
    button.addEventListener('click', () => { goTo(index); overview.close(); });
    element('overview-grid').append(button);
    choices.push(button);
  });

  element('retry').addEventListener('click', () => location.reload());
  element('animation-toggle').addEventListener('click', toggleAnimation);
  element('animation-replay').addEventListener('click', replayAnimation);
  element('copy-text').addEventListener('click', async () => {
    const text = [...textLayer.querySelectorAll('.slide-label:not([hidden])')].map((label) => label.textContent).filter((label) => label !== '+' && label !== 'H').join('\n');
    try {
      let copied = false;
      if (location.protocol !== 'file:' && navigator.clipboard?.writeText) {
        try { await navigator.clipboard.writeText(text); copied = true; }
        catch { copied = false; }
      }
      if (!copied) {
        const input = document.createElement('textarea');
        input.value = text;
        input.style.cssText = 'position:fixed;left:-10000px;top:0;';
        document.body.append(input);
        input.select();
        copied = document.execCommand('copy');
        input.remove();
        element('copy-text').focus();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      report('Slide text copied.');
    } catch { report('Select the text directly, then press Ctrl+C or Command+C to copy.'); }
  });
  element('previous').addEventListener('click', () => goTo(current - 1));
  element('next').addEventListener('click', () => goTo(current + 1));
  element('overview-open').addEventListener('click', openOverview);
  element('overview-close').addEventListener('click', () => overview.close());
  overview.addEventListener('click', (event) => { if (event.target === overview) overview.close(); });
  overview.addEventListener('close', () => element('overview-open').focus());
  element('fullscreen').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => { element('fullscreen').textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen'; });
  for (const eventName of ['hashchange', 'popstate']) window.addEventListener(eventName, () => goTo(hashIndex(), true));
  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || overview.open || event.target.closest('input,textarea,select,[contenteditable]')) return;
    if (event.code === 'Space' && event.target.closest('button,a')) return;
    if (['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', 'Space', 'Home', 'End', 'KeyO', 'KeyF', 'KeyP', 'KeyR'].includes(event.code)) event.preventDefault();
    if (['ArrowRight', 'PageDown'].includes(event.code) || (event.code === 'Space' && !event.shiftKey)) goTo(current + 1);
    if (['ArrowLeft', 'PageUp'].includes(event.code) || (event.code === 'Space' && event.shiftKey)) goTo(current - 1);
    if (event.code === 'Home') goTo(0);
    if (event.code === 'End') goTo(slides.length - 1);
    if (event.code === 'KeyO') openOverview();
    if (event.code === 'KeyF') void toggleFullscreen();
    if (event.code === 'KeyP') toggleAnimation();
    if (event.code === 'KeyR') replayAnimation();
  });
  textLayer.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.slide-label')) selecting = true;
  });
  const finishSelection = () => { selecting = false; };
  document.addEventListener('pointerup', finishSelection);
  document.addEventListener('pointercancel', finishSelection);
  document.addEventListener('selectionchange', () => {
    const selection = getSelection();
    selectionHeld = Boolean(selection && !selection.isCollapsed && (textLayer.contains(selection.anchorNode) || textLayer.contains(selection.focusNode)));
    if (selectionHeld) report('Animation held while text is selected. Ctrl+C / Command+C to copy.');
  });
  element('viewer').addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' && event.isPrimary && !event.target.closest('.slide-label')) touchStart = { horizontal: event.clientX, vertical: event.clientY, identifier: event.pointerId };
  });
  element('viewer').addEventListener('pointerup', (event) => {
    if (!touchStart || touchStart.identifier !== event.pointerId) return;
    const horizontal = event.clientX - touchStart.horizontal;
    const vertical = event.clientY - touchStart.vertical;
    touchStart = null;
    if (Math.abs(horizontal) > 55 && Math.abs(horizontal) > Math.abs(vertical) * 1.3) goTo(current + (horizontal < 0 ? 1 : -1));
  });
  element('viewer').addEventListener('pointercancel', () => { touchStart = null; });
  element('overview-open').disabled = false;
  element('fullscreen').disabled = false;
  goTo(hashIndex(), true);
  updateAnimationButton();
  const resize = () => { surface.style.transform = `scale(${element('viewer').clientWidth / 1920})`; };
  new ResizeObserver(resize).observe(element('viewer'));
  resize();
  window.harnessSlides = {
    ready: false,
    state: () => ({ index: current, elapsed, paused, selecting, selectionHeld, overview: overview.open, fatalError, audio: false }),
    seek(index, seconds = 0) {
      goTo(index);
      clearSlideSelection();
      elapsed = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
      paused = true;
      updateAnimationButton();
      drawCurrent();
    }
  };
  const fail = (message) => {
    fatalError = true;
    element('loading').hidden = true;
    element('slide-error').hidden = false;
    element('error-message').textContent = message;
    for (const identifier of ['animation-toggle', 'animation-replay']) element(identifier).disabled = true;
    window.harnessSlides.ready = false;
    window.harnessSlides.error = message;
  };
  createLiveStage(element('slide-canvas'), textLayer).then((liveStage) => {
    stage = liveStage;
    stage.onContextLost(() => fail('Graphics context lost. Reload to restore the live scene.'));
    drawCurrent();
    element('loading').hidden = true;
    for (const identifier of ['animation-toggle', 'animation-replay', 'copy-text']) element(identifier).disabled = false;
    window.harnessSlides.ready = true;
    previousTime = performance.now();
    requestAnimationFrame(tick);
  }).catch((error) => fail(`Cannot start the live slides: ${error.message}`));
})();
