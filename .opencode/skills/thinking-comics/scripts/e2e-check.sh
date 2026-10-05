#!/bin/bash
# End-to-end check for every comic in the Thinking repo.
#
# Usage, from the repo root:
#   bash .opencode/skills/thinking-comics/scripts/e2e-check.sh
#
# Renders each comic in headless Chrome at desktop (1440x900) and mobile
# (390x844) sizes, measures the rendered DOM, and prints one line per page.
# Any FAIL / WRAPPED / VOVERFLOW / DIFF means a punchline no longer fits or a
# page is broken -- fix before committing.

set -u
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "headless Chrome not found at: $CHROME" >&2
  exit 1
fi

trap 'find . -name "*.test.html" -delete 2>/dev/null' EXIT

python3 - <<'PYEOF'
import pathlib

CHECKER = """
<script>
window.addEventListener('load', function () {
  var ready = (document.fonts && document.fonts.ready) || Promise.resolve();
  ready.then(function () { setTimeout(report, 50); });
  function report() {
    var out = [];
    var panels = document.querySelectorAll('.panel');
    out.push('panels=' + panels.length);
    var cs = getComputedStyle(panels[0]);
    var cssOK = cs.borderTopWidth !== '0px' && cs.backgroundColor !== 'rgba(0, 0, 0, 0)';
    out.push('css=' + (cssOK ? 'OK' : 'FAIL'));
    var r = document.querySelector('.comic').getBoundingClientRect();
    var fitH = (r.top >= -1 && r.bottom <= window.innerHeight + 1);
    out.push('fitHeight=' + (fitH ? 'OK' : 'FAIL') + '(' + Math.round(r.height) + '/' + window.innerHeight + ')');
    out.push('fitWidth=' + (document.documentElement.scrollWidth <= window.innerWidth + 1 ? 'OK' : 'FAIL'));
    var scenes = [];
    for (var i = 0; i < panels.length; i++) {
      var scope = panels[i].querySelector('.scene') || panels[i];
      var names = [];
      scope.querySelectorAll(':scope > div').forEach(function (d) { names.push(d.className); });
      scenes.push(names.join(','));
    }
    out.push('scene=' + (scenes[0] === scenes[1] ? 'same' : 'DIFF'));
    document.querySelectorAll('.screen p').forEach(function (p, i) {
      var lh = parseFloat(getComputedStyle(p).lineHeight);
      var lines = p.innerHTML.split(/<br\\s*\\/?>/i).length;
      var h = p.getBoundingClientRect().height;
      var rendered = Math.round((h / lh) * 100) / 100;
      var screen = p.closest('.screen').getBoundingClientRect();
      var flag = '';
      if (rendered > lines + 0.1) flag += ' WRAPPED';
      if (h > screen.height + 1) flag += ' VOVERFLOW';
      out.push('p' + i + ': lines=' + lines + ' rendered=' + rendered + (flag || ' ok'));
    });
    var idle = document.querySelector('.panel .screen p.idle');
    out.push('thinking=' + (idle && idle.textContent.indexOf('Thinking') !== -1 ? 'OK' : 'FAIL'));
    var pre = document.createElement('pre');
    pre.id = 'test-results';
    pre.textContent = 'RESULTS: ' + out.join(' | ');
    document.body.appendChild(pre);
  }
});
</script>
"""

root = pathlib.Path.cwd()
pages = ([root / 'thinking.html']
         + sorted((root / 'examples').glob('*.html'))
         + sorted((root / 'originals').glob('*.html'))
         + sorted((root / 'thoughts').glob('*.html')))
for f in pages:
    html = f.read_text()
    (f.parent / (f.stem + '.test.html')).write_text(html.replace('</body>', CHECKER + '</body>'))
print('injected', len(pages), 'test pages')
PYEOF

fail=0
for size in 1440,900 390,844; do
  for f in thinking.test.html examples/*.test.html originals/*.test.html thoughts/*.test.html; do
    [ -e "$f" ] || continue
    res=$("$CHROME" --headless=new --disable-gpu --window-size=$size --virtual-time-budget=4000 --dump-dom "file://$PWD/$f" 2>/dev/null | grep -o 'RESULTS: [^<]*' | tail -1)
    bad=1
    case "$res" in
      *"panels=2 | css=OK"*"scene=same"*"thinking=OK"*)
        case "$res" in
          *WRAPPED*|*VOVERFLOW*|*FAIL*|*DIFF*) bad=1;;
          *) bad=0;;
        esac;;
    esac
    if [ "$bad" -eq 1 ]; then
      fail=1
      echo "BAD  $f @$size"
      echo "     $res"
    else
      echo "ok   $f @$size"
    fi
  done
done

if [ "$fail" -eq 0 ]; then
  echo "ALL PASS"
else
  echo "FAILURES FOUND"
  exit 1
fi
