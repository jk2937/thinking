// "Thinking..." — one page, every comic. The hash is the comic number (#12).
// The scene never changes; only panel 2's thought, the signature and the nav do.
(() => {
  const comics = window.COMICS || [];
  const total = comics.length;
  if (!total) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const figure = document.querySelector('.comic');
  const thought = document.querySelector('.thought');
  const wipe = document.querySelector('.wipe');
  const signature = document.querySelector('.signature');
  const signatureCredit = signature.querySelector('.signature-credit');
  const signatureNote = signature.querySelector('.signature-note');
  const count = document.querySelector('.count');
  const countNow = document.querySelector('.count-now');
  const buttons = {};
  document.querySelectorAll('[data-go]').forEach((a) => { buttons[a.dataset.go] = a; });

  // Motion on fours: a few hard frames, no easing (STYLE.md, Motion).
  const WIPE = { duration: 180, easing: 'steps(4, end)', fill: 'forwards' };
  const TICK = { duration: 180, easing: 'steps(3, end)' };

  let current = 0;
  let target = 0;
  let busy = false;

  const fromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return n >= 1 && n <= total ? n : 1;
  };

  function setLink(a, n) {
    if (n) {
      a.href = '#' + n;
      a.removeAttribute('aria-disabled');
    } else {
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
    }
  }

  // Shrink long thoughts until they sit inside the screen with some air.
  function fit() {
    let scale = 1;
    thought.style.setProperty('--fit', scale);
    const room = thought.parentElement.clientHeight * 0.9;
    while (thought.offsetHeight > room && scale > 0.7) {
      scale -= 0.05;
      thought.style.setProperty('--fit', scale);
    }
  }

  function render(n) {
    const comic = comics[n - 1];
    thought.replaceChildren();
    if (comic.setup) {
      const setup = document.createElement('span');
      setup.className = 'setup';
      setup.textContent = comic.setup;
      thought.append(setup, ' ');
    }
    const punch = document.createElement('strong');
    punch.className = 'punch';
    punch.textContent = comic.punch;
    thought.append(punch);
    fit();

    signatureCredit.textContent = comic.credit.join(' · ');
    signatureNote.textContent = comic.note || '';
    signatureNote.hidden = !comic.note;
    setLink(buttons.first, n > 1 && 1);
    setLink(buttons.prev, n > 1 && n - 1);
    setLink(buttons.next, n < total && n + 1);
    setLink(buttons.last, n < total && total);
    countNow.textContent = n;
    count.setAttribute('aria-label', `Comic ${n} of ${total}`);
    figure.setAttribute('aria-label', `Thinking... comic ${n} of ${total}`);
    document.title = `Thinking... — ${n} of ${total}`;
    current = n;
  }

  async function show(n) {
    target = n;
    if (busy || n === current) return;
    const dir = n > current ? 1 : -1;
    if (reduceMotion.matches || !wipe.animate) {
      render(n);
      return;
    }

    busy = true;
    // Hatch sweeps over the old thought in the direction of travel, then off.
    const cover = dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
    const uncover = dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
    await wipe.animate([{ clipPath: cover }, { clipPath: 'inset(0 0 0 0)' }], WIPE).finished;
    render(target);
    countNow.animate(
      [{ transform: `translateY(${dir * 0.7}em)`, opacity: 0 }, { transform: 'none', opacity: 1 }], TICK);
    signature.animate([{ opacity: 0 }, { opacity: 1 }], TICK);
    await wipe.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: uncover }], WIPE).finished;
    busy = false;
    if (target !== current) show(target);
  }

  window.addEventListener('hashchange', () => show(fromHash()));

  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const n = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 1, End: total }[e.key];
    if (!n || n < 1 || n > total || n === current) return;
    e.preventDefault();
    location.hash = n;
  });

  window.addEventListener('resize', () => requestAnimationFrame(fit));

  // The steam boils on its own; hold it still for reduced motion.
  if (reduceMotion.matches) document.querySelectorAll('animate.steam').forEach((a) => a.remove());

  render(fromHash());
})();
