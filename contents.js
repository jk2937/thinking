// Fills the About page's "Every comic" list from comics.js, so it never
// drifts from the comics themselves.
(() => {
  const comics = window.COMICS || [];
  const list = document.querySelector('.contents');
  if (!list || !comics.length) return;

  comics.forEach((comic, i) => {
    const n = i + 1;
    const link = document.createElement('a');
    link.href = `comics.html#${n}`;

    const no = document.createElement('span');
    no.className = 'contents-no';
    no.textContent = n;

    const line = document.createElement('span');
    line.className = 'contents-line';
    if (comic.setup) line.append(comic.setup + ' ');
    const punch = document.createElement('strong');
    punch.textContent = comic.punch;
    line.append(punch);

    link.append(no, line);
    const item = document.createElement('li');
    item.append(link);
    list.append(item);
  });

  document.querySelectorAll('[data-latest]').forEach((a) => { a.href = `comics.html#${comics.length}`; });
  document.querySelectorAll('[data-total]').forEach((el) => { el.textContent = comics.length; });
})();
