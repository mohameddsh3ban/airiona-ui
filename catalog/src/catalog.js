/* Airiona Catalog: browse every component in React and Angular, copy code, read the API, export PNGs. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var md = function (s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('airiona-catalog:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('airiona-catalog:' + k, JSON.stringify(v)); } catch (e) { /* storage blocked: keep in memory only */ } },
  };

  var KINDS = [
    { id: 'all', label: 'All' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'motion', label: 'Motion' },
    { id: 'forms', label: 'Form controls' },
  ];
  var WIDTHS = [{ id: 'fit', label: 'Fit' }, { id: 390, label: '390' }, { id: 768, label: '768' }, { id: 1280, label: '1280' }];
  var ZOOMS = [1, 2, 3];

  var state = {
    m: null,
    fw: store.get('fw', 'react'),
    kind: store.get('kind', 'all'),
    q: '',
    width: store.get('width', 'fit'),
    zoom: 1,
    tab: store.get('tab', 'code'),
    picks: store.get('picks', []),
  };

  /* ---------------- data ---------------- */
  function matchesKind(c) {
    if (state.kind === 'all') return true;
    if (state.kind === 'mobile') return /^Mobile/.test(c.group);
    if (state.kind === 'web') return !/^Mobile/.test(c.group) && c.kind !== 'motion';
    if (state.kind === 'motion') return c.kind === 'motion' || c.motion.length > 0 && /Motion/.test(c.group);
    if (state.kind === 'forms') return !!(c.angular && c.angular.formControl);
    return true;
  }
  function score(c, q) {
    if (!q) return 1;
    var name = c.name.toLowerCase(), s = 0;
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    for (var i = 0; i < words.length; i++) {
      var w = words[i], hit = 0;
      if (name === w) hit = 100; else if (name.indexOf(w) === 0) hit = 60; else if (name.indexOf(w) >= 0) hit = 40;
      else if (c.group.toLowerCase().indexOf(w) >= 0) hit = 20;
      else if (c.summary.toLowerCase().indexOf(w) >= 0) hit = 14;
      else if (c.keywords.join(' ').indexOf(w) >= 0) hit = 10;
      else if ((c.notes.join(' ') + ' ' + c.provides).toLowerCase().indexOf(w) >= 0) hit = 6;
      if (!hit) return 0;
      s += hit;
    }
    return s;
  }
  function visible() {
    var q = state.q.trim();
    return state.m.components
      .filter(matchesKind)
      .map(function (c) { return { c: c, s: score(c, q) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return q ? b.s - a.s : 0; })
      .map(function (x) { return x.c; });
  }
  var bySlug = function (slug) { return state.m.components.find(function (c) { return c.slug === slug; }); };

  /* ---------------- shell ---------------- */
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.classList.remove('is-on'); }, 1800);
  }
  function copy(text, label) {
    var done = function () { toast(label || 'Copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* the text stays selected for a manual copy */ }
    document.body.removeChild(ta);
  }

  function renderFw() {
    document.querySelectorAll('[data-fw]').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.fw === state.fw)); });
  }
  function renderKinds() {
    $('#kinds').innerHTML = KINDS.map(function (k) {
      return '<button type="button" class="cx-chip" data-kind="' + k.id + '" aria-pressed="' + (state.kind === k.id) + '">' + k.label + '</button>';
    }).join('');
  }
  function renderNav() {
    var list = visible(), cur = route().slug, html = '';
    if (state.q.trim()) {
      html = '<h3>Results <span>' + list.length + '</span></h3>' + list.map(navLink).join('');
    } else {
      state.m.groups.forEach(function (g) {
        var items = list.filter(function (c) { return c.group === g; });
        if (!items.length) return;
        html += '<h3>' + esc(g) + ' <span>' + items.length + '</span></h3>' + items.map(navLink).join('');
      });
    }
    $('#nav').innerHTML = html || '<p class="empty">Nothing matches. Try a use case such as “date range”, “sticky”, “price”.</p>';
    function navLink(c) {
      var picked = state.picks.indexOf(c.name) >= 0;
      return '<a href="#' + c.slug + '"' + (c.slug === cur ? ' aria-current="page"' : '') + '>' + esc(c.name) + (picked ? '<i class="dot" title="In your selection"></i>' : '') + '</a>';
    }
  }
  function renderTray() {
    var n = state.picks.length;
    $('#tray').hidden = n === 0;
    $('#tray-count').textContent = n + (n === 1 ? ' component' : ' components');
    $('#tray-names').textContent = state.picks.join(', ');
  }
  function togglePick(name) {
    var i = state.picks.indexOf(name);
    if (i >= 0) state.picks.splice(i, 1); else state.picks.push(name);
    store.set('picks', state.picks);
    renderTray(); renderNav();
    document.querySelectorAll('[data-pick="' + name + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(i < 0)); b.textContent = i < 0 ? 'Selected' : 'Select'; });
  }

  /* ---------------- routing ---------------- */
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (!h) return { view: 'home' };
    if (h === 'foundations' || h === 'exports' || h === 'pipeline') return { view: h };
    return { view: 'component', slug: h };
  }
  function render() {
    var r = route();
    document.querySelectorAll('.cx-toplinks a').forEach(function (a) { a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + r.view); });
    if (r.view === 'component') {
      var c = bySlug(r.slug);
      if (c) viewComponent(c); else viewHome();
    } else if (r.view === 'foundations') viewFoundations();
    else if (r.view === 'exports') viewExports();
    else if (r.view === 'pipeline') viewPipeline();
    else viewHome();
    renderNav();
    $('#side').classList.remove('is-open');
    $('#menu').setAttribute('aria-expanded', 'false');
  }

  /* ---------------- home ---------------- */
  function viewHome() {
    var m = state.m, list = visible(), main = $('#main');
    var groups = state.q.trim() ? [['Results', list]] : m.groups.map(function (g) { return [g, list.filter(function (c) { return c.group === g; })]; }).filter(function (g) { return g[1].length; });
    main.innerHTML =
      '<section class="cx-hero"><div><p class="cx-eyebrow">Airiona design system · v' + esc(m.version) + '</p>' +
      '<h1 class="cx-h1">Every component, in React and Angular</h1>' +
      '<p class="cx-lede">Pick a component to see it live in either framework, copy its code, read its API and motion, or export a high-resolution PNG. Both builds render the same markup and were diffed pixel for pixel.</p></div>' +
      '<div class="cx-facts"><div class="cx-fact"><b>' + m.components.length + '</b><span>components</span></div><div class="cx-fact"><b>2</b><span>frameworks</span></div><div class="cx-fact"><b>' + m.components.filter(function (c) { return c.motion.length; }).length + '</b><span>with motion specs</span></div></div></section>' +
      groups.map(function (g) {
        return '<div class="cx-group"><h2>' + esc(g[0]) + '</h2><span>' + g[1].length + '</span></div><div class="cx-grid">' + g[1].map(card).join('') + '</div>';
      }).join('');
    function card(c) {
      var picked = state.picks.indexOf(c.name) >= 0;
      return '<a class="cx-card" href="#' + c.slug + '"><span class="cx-card__thumb" style="background-image:url(\'thumbs/' + c.slug + '.jpg\')"></span>' +
        '<span class="cx-card__body"><b>' + esc(c.name) + '</b><span>' + esc(c.summary) + '</span></span>' +
        '<span class="cx-card__pick"><button type="button" class="cx-pick" data-pick="' + c.name + '" aria-pressed="' + picked + '">' + (picked ? 'Selected' : 'Select') + '</button></span></a>';
    }
  }

  /* ---------------- component ---------------- */
  var frames = {};
  function previewUrl(c, fw) { return fw === 'react' ? 'react/' + c.name + '.html' : 'ng/index.html?solo#' + c.slug; }

  function viewComponent(c) {
    var main = $('#main');
    var fws = state.fw === 'both' ? ['react', 'angular'] : [state.fw];
    var ng = c.angular;
    var sel = ng ? (ng.tag && ng.attr ? '<' + ng.tag + ' ' + ng.attr + '>' : ng.attr ? '[' + ng.attr + ']' : '<' + ng.tag + '>') : '';
    var picked = state.picks.indexOf(c.name) >= 0;
    main.innerHTML =
      '<div class="cx-head"><div class="cx-head__titles"><p class="cx-eyebrow">' + esc(c.group) + '</p><h1 class="cx-h1">' + esc(c.name) + '</h1>' +
      '<p class="cx-lede">' + md(c.summary) + '</p>' +
      '<div class="cx-tags"><span class="cx-tag"><code>' + esc(c.react.import.replace(/^import /, '').replace(/;$/, '')) + '</code></span>' +
      (ng ? '<span class="cx-tag"><code>' + esc(sel) + '</code></span>' : '') +
      (ng && ng.formControl ? '<span class="cx-tag">Form control: ngModel / formControlName</span>' : '') +
      '<span class="cx-tag cx-tag--ok">Pixel-identical in React and Angular</span></div></div>' +
      '<div class="cx-head__actions"><button type="button" class="cx-btn cx-btn--ghost" data-pick="' + c.name + '" aria-pressed="' + picked + '">' + (picked ? 'Selected' : 'Select') + '</button></div></div>' +

      '<div class="cx-stagebox"><div class="cx-toolbar">' +
      '<div class="cx-toolbar__group"><span class="cx-toolbar__label">Width</span><div class="cx-seg" id="widths">' + WIDTHS.map(function (w) { return '<button type="button" data-width="' + w.id + '" aria-pressed="' + (String(state.width) === String(w.id)) + '">' + w.label + '</button>'; }).join('') + '</div></div>' +
      '<div class="cx-toolbar__group"><span class="cx-toolbar__label">Resolution</span><div class="cx-seg" id="zooms">' + ZOOMS.map(function (z) { return '<button type="button" data-zoom="' + z + '" aria-pressed="' + (state.zoom === z) + '">' + z + '×</button>'; }).join('') + '</div></div>' +
      '<div class="cx-toolbar__end"><button type="button" class="cx-btn cx-btn--ghost" id="replay">Replay</button>' +
      '<button type="button" class="cx-btn cx-btn--ghost" id="open-new">Open alone</button>' +
      '<button type="button" class="cx-btn" id="export-png">Export PNG</button></div></div>' +
      '<div class="cx-stages' + (fws.length > 1 ? ' is-both' : '') + '">' + fws.map(function (fw) {
        return '<div class="cx-stage"><span class="cx-stage__label">' + (fw === 'react' ? 'React' : 'Angular') + '</span><div class="cx-stage__scroll"><iframe name="' + fw + '" title="' + esc(c.name) + ' in ' + fw + '" loading="eager"></iframe></div></div>';
      }).join('') + '</div></div>' +

      '<div class="cx-tabs" role="tablist">' + ['code', 'api', 'usage', 'motion'].map(function (t) {
        return '<button type="button" role="tab" data-tab="' + t + '" aria-selected="' + (state.tab === t) + '">' + { code: 'Code', api: 'API', usage: 'Usage', motion: 'Motion' }[t] + '</button>';
      }).join('') + '</div><div class="cx-panel" id="panel" role="tabpanel"></div>';

    frames = {};
    fws.forEach(function (fw) {
      var f = $('iframe[name="' + fw + '"]', main);
      frames[fw] = f;
      f._min = c.height; // the design-system card height also covers popovers that float outside the page flow
      f.src = previewUrl(c, fw);
      sizeFrame(f);
    });
    renderPanel(c);
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function sizeFrame(f) {
    var w = state.width === 'fit' ? '100%' : state.width + 'px';
    f.style.width = w;
    f.style.zoom = String(state.zoom);
    f.style.height = Math.max(f._h || 0, f._min || 160) + 'px';
  }

  window.addEventListener('message', function (e) {
    var d = e.data || {};
    // Only our own preview frames may talk to the catalog.
    if (!frames[d.frame] || e.source !== frames[d.frame].contentWindow) return;
    if (d.type === 'airiona:size') {
      frames[d.frame]._h = Math.max(120, d.h);
      sizeFrame(frames[d.frame]);
    }
    if (d.type === 'airiona:snapshot' && pending[d.id]) {
      if (d.url && !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(d.url)) d = { error: 'The preview returned something other than a PNG.' };
      pending[d.id](d); delete pending[d.id];
    }
  });

  /* PNG export: each frame renders its own stage with html-to-image at the chosen resolution. */
  var pending = {}, seq = 0;
  function snapshot(fw, scale) {
    return new Promise(function (resolve) {
      var id = ++seq;
      pending[id] = resolve;
      frames[fw].contentWindow.postMessage({ type: 'airiona:snapshot', id: id, scale: scale }, '*');
      setTimeout(function () { if (pending[id]) { delete pending[id]; resolve({ error: 'The preview did not answer. Reload and try again.' }); } }, 20000);
    });
  }
  function exportPng(c) {
    var scale = Math.max(2, state.zoom);
    var body = $('#modal-body');
    $('#modal-title').textContent = c.name + ' at ' + scale + '×';
    body.innerHTML = '<p class="cx-lede">Rendering…</p>';
    $('#modal').hidden = false;
    Promise.all(Object.keys(frames).map(function (fw) { return snapshot(fw, scale).then(function (r) { r.fw = fw; return r; }); })).then(function (shots) {
      body.innerHTML = shots.map(function (s) {
        if (s.error) return '<p class="cx-lede">' + (s.fw === 'react' ? 'React' : 'Angular') + ': ' + esc(s.error) + '</p>';
        var file = 'airiona-' + c.slug + '-' + s.fw + '@' + scale + 'x.png';
        return '<div><p class="cx-eyebrow">' + (s.fw === 'react' ? 'React' : 'Angular') + ' · ' + Math.round(s.w * scale) + ' × ' + Math.round(s.h * scale) + ' px</p>' +
          '<img alt="' + esc(c.name) + ' snapshot" src="' + esc(s.url) + '">' +
          '<p><a class="cx-btn" download="' + esc(file) + '" href="' + esc(s.url) + '">Download ' + esc(file) + '</a> <span class="cx-lede">If the download is blocked here, right-click the image and save it.</span></p></div>';
      }).join('');
    });
  }

  function renderPanel(c) {
    var p = $('#panel');
    document.querySelectorAll('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === state.tab)); });
    var fw = state.fw === 'angular' ? 'angular' : state.fw === 'both' ? store.get('codefw', 'angular') : 'react';
    if (state.tab === 'code') {
      var code = fw === 'react' ? c.react.code : c.angular && c.angular.code;
      var imp = fw === 'react' ? c.react.import : c.angular && c.angular.import;
      p.innerHTML = '<div class="cx-codehead"><code>' + esc(imp) + '</code><div class="cx-toolbar__group">' +
        (state.fw === 'both' ? '<div class="cx-seg" id="codefw"><button type="button" data-codefw="react" aria-pressed="' + (fw === 'react') + '">React</button><button type="button" data-codefw="angular" aria-pressed="' + (fw === 'angular') + '">Angular</button></div>' : '') +
        '<button type="button" class="cx-btn" id="copy-code">Copy ' + (fw === 'react' ? 'React' : 'Angular') + ' code</button></div></div>' +
        '<pre class="cx-code"><code class="language-' + (fw === 'react' ? 'jsx' : 'typescript') + '">' + esc(code || '// No example yet.') + '</code></pre>';
      if (window.Prism) window.Prism.highlightAllUnder(p);
      $('#copy-code').onclick = function () { copy(code || '', (fw === 'react' ? 'React' : 'Angular') + ' code copied'); };
      var cf = $('#codefw');
      if (cf) cf.onclick = function (e) { var b = e.target.closest('[data-codefw]'); if (b) { store.set('codefw', b.dataset.codefw); renderPanel(c); } };
    } else if (state.tab === 'api') {
      p.innerHTML = fw === 'react' || !c.angular ? reactApi(c) : angularApi(c);
      if (state.fw === 'both') p.insertAdjacentHTML('afterbegin', '<p class="cx-lede">Showing the ' + (fw === 'react' ? 'React' : 'Angular') + ' API. Switch the code language on the Code tab to change it.</p>');
    } else if (state.tab === 'usage') {
      p.innerHTML = '<div class="cx-prose">' +
        (c.provides ? '<h3 class="cx-sub">Consumer provides</h3><p>' + md(c.provides) + '</p>' : '') +
        (c.notes.length ? '<h3 class="cx-sub">Guidance</h3><ul>' + c.notes.map(function (n) { return '<li>' + md(n) + '</li>'; }).join('') + '</ul>' : '') +
        (c.angular && c.angular.doc ? '<h3 class="cx-sub">Angular notes</h3><p>' + md(c.angular.doc) + '</p>' : '') + '</div>';
    } else {
      var tokens = state.m.motionTokens;
      p.innerHTML = c.motion.length
        ? '<div class="cx-tablewrap"><table class="cx-table"><thead><tr><th>Moment</th><th>Behaviour</th></tr></thead><tbody>' +
          c.motion.map(function (r) { return '<tr><td><b>' + esc(r.moment) + '</b></td><td class="doc">' + md(r.behaviour) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
          '<p class="cx-lede" style="margin-top:12px">All motion stops under <code>prefers-reduced-motion</code>; state changes still apply instantly. Press Replay above to run the entrance again. Durations: ' + tokens.duration.map(function (t) { return '<code>' + esc(t.name) + '</code> ' + esc(t.value); }).join(' · ') + '</p>'
        : '<p class="cx-lede">No motion of its own beyond the shared hover and focus states.</p>';
    }
  }
  function reactApi(c) {
    if (!c.react.props.length) return '<p class="cx-lede">No props documented.</p>';
    return '<div class="cx-tablewrap"><table class="cx-table"><thead><tr><th>Prop</th><th>Type</th><th>Notes</th></tr></thead><tbody>' + c.react.props.map(function (pr) {
      return '<tr><td><code>' + esc(pr.name) + '</code>' + (pr.optional ? '' : '<span class="cx-pill cx-pill--req">required</span>') + (pr.from ? '<span class="cx-pill">' + esc(pr.from.replace(/Props$/, '')) + '</span>' : '') + '</td><td class="type"><code>' + esc(pr.type) + '</code></td><td class="doc">' + md(pr.doc) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  }
  function angularApi(c) {
    var a = c.angular, html = '';
    html += '<h3 class="cx-sub" style="margin-top:0">Inputs</h3>' + (a.inputs.length ? '<div class="cx-tablewrap"><table class="cx-table"><thead><tr><th>Input</th><th>Type</th><th>Default</th><th>Notes</th></tr></thead><tbody>' + a.inputs.map(function (i) {
      return '<tr><td><code>' + esc(i.name) + '</code>' + (i.kind === 'model' ? '<span class="cx-pill cx-pill--model">two-way</span>' : i.kind === 'required' ? '<span class="cx-pill cx-pill--req">required</span>' : '') + '</td><td class="type"><code>' + esc(i.type || 'inferred') + '</code></td><td><code>' + esc(i.default == null ? '' : i.default) + '</code></td><td class="doc">' + md(i.doc) + '</td></tr>';
    }).join('') + '</tbody></table></div>' : '<p class="cx-lede">None.</p>');
    if (a.outputs.length) html += '<h3 class="cx-sub">Outputs</h3><div class="cx-tablewrap"><table class="cx-table"><thead><tr><th>Output</th><th>Payload</th><th>Notes</th></tr></thead><tbody>' + a.outputs.map(function (o) { return '<tr><td><code>(' + esc(o.name) + ')</code></td><td class="type"><code>' + esc(o.type) + '</code></td><td class="doc">' + md(o.doc) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    if (a.slots.length) html += '<h3 class="cx-sub">Content slots</h3><p class="cx-lede">' + a.slots.map(function (s) { return '<code>' + esc(s === '(default)' ? 'default <ng-content>' : s) + '</code>'; }).join(' · ') + '</p>';
    if (a.helpers.length) html += '<h3 class="cx-sub">Companion directives</h3><p class="cx-lede">' + a.helpers.map(function (h) { return '<code>' + esc(h.className) + '</code> <code>' + esc(h.selector) + '</code>'; }).join(' · ') + '</p>';
    html += '<p class="cx-lede" style="margin-top:14px">Source: <code>' + esc(a.file) + '</code></p>';
    return html;
  }

  /* ---------------- foundations ---------------- */
  function viewFoundations() {
    var tok = state.m.tokens || {};
    var main = $('#main');
    main.innerHTML = '<p class="cx-eyebrow">Foundations</p><h1 class="cx-h1">Tokens and motion</h1><p class="cx-lede">Every colour, radius, shadow, duration and curve is a CSS variable from <code>tokens.css</code>, shared by both packages. Click a swatch to copy its variable.</p>' +
      '<h2 class="cx-h2" style="margin-top:28px">Colour</h2><div class="cx-swatches">' + (tok.color || []).map(function (t) {
        return '<button type="button" class="cx-swatch" data-copy="var(--' + esc(t.name) + ')"><i style="background:' + esc(t.value) + '"></i><span><b>--' + esc(t.name) + '</b>' + esc(t.value) + '</span></button>';
      }).join('') + '</div>' +
      '<h2 class="cx-h2" style="margin-top:28px">Motion</h2><p class="cx-lede" style="margin-bottom:12px">Click a curve to run it at its duration.</p><div class="cx-motion">' + state.m.motionTokens.easing.map(function (e, i) {
        var d = state.m.motionTokens.duration[Math.min(i + 2, state.m.motionTokens.duration.length - 1)];
        return '<button type="button" data-ease="' + esc(e.value) + '" data-dur="' + esc(d.value) + '"><b>--' + esc(e.name) + '</b><small>' + esc(e.value) + ' · ' + esc(d.value) + '</small><i></i></button>';
      }).join('') + '</div>' +
      '<h2 class="cx-h2" style="margin-top:28px">Radius, shadow, spacing</h2><div class="cx-tablewrap"><table class="cx-table"><thead><tr><th>Token</th><th>Value</th></tr></thead><tbody>' +
      ['radius', 'shadow', 'spacing'].map(function (g) { return (tok[g] || []).map(function (t) { return '<tr><td><code>--' + esc(t.name) + '</code></td><td class="type"><code>' + esc(t.value) + '</code></td></tr>'; }).join(''); }).join('') + '</tbody></table></div>';
  }

  /* ---------------- exports + pipeline ---------------- */
  function codeBox(title, text, cmd, lang) {
    return '<div class="cx-box"><h3>' + esc(title) + '</h3><p>' + text + '</p>' + (cmd ? '<pre class="cx-code"><code class="language-' + (lang || 'bash') + '">' + esc(cmd) + '</code></pre>' : '') + '</div>';
  }
  function viewExports() {
    var m = state.m;
    $('#main').innerHTML = '<p class="cx-eyebrow">Exports</p><h1 class="cx-h1">Take it into your app</h1><p class="cx-lede">Both packages ship the same tokens, styles and assets. Build every artefact with one command from the repository root; the output lands in <code>exports/</code>.</p>' +
      '<div class="cx-cards" style="margin-top:24px">' +
      codeBox('Everything at once', 'Angular and React packages, tokens (CSS, JSON, TypeScript), this catalog as a static site, high-resolution PNGs of every component and the page-conversion skill.', 'npm run export') +
      codeBox('Angular 20+', 'Standalone, signal-based components. <code>ng add</code> wires the stylesheet and <code>provideAiriona()</code>.', 'ng add ./exports/airiona-ui-' + m.version + '.tgz') +
      codeBox('React 18 and 19', 'ES module, CommonJS and UMD builds with TypeScript types. Server rendering safe.', 'npm install ./exports/airiona-react-' + m.version + '.tgz\n\n// main.tsx\nimport "@airiona/react/styles/airiona.css";\nimport { Button } from "@airiona/react";') +
      codeBox('Tokens only', 'For tools outside the component packages: Figma plugins, native apps, email templates.', 'exports/tokens/tokens.css\nexports/tokens/tokens.json\nexports/tokens/tokens.ts') +
      codeBox('PNG at 1×, 2× or 3×', 'Every component, in both frameworks, rendered by a real browser at the device scale you choose. For one component, use Export PNG on its page.', 'npm run export:png -- --scale 3') +
      codeBox('This catalog', 'A static site: host <code>exports/catalog/</code> on any web server for the team, or open it locally.', 'npm run catalog\n# http://localhost:4400') +
      '</div>';
    if (window.Prism) window.Prism.highlightAllUnder($('#main'));
  }
  function viewPipeline() {
    $('#main').innerHTML = '<p class="cx-eyebrow">Page pipeline</p><h1 class="cx-h1">From a page design to Airiona components</h1><p class="cx-lede">The <code>airiona-page-convert</code> skill for Claude Code reads one page at a time, from a screenshot, design export, URL or written brief, and maps every section and element to the component that fits. It plans the mobile layout first, then writes a machine-checked spec, a handoff document and a working Angular page.</p>' +
      '<ol class="cx-steps" style="margin-top:24px">' +
      '<li><div><b>Inventory</b><span>Sections and elements, top to bottom, with what each one is for.</span></div></li>' +
      '<li><div><b>Mobile layout first</b><span>390 px stack order, sticky bars, sheets instead of modals, thumb reach. Then 768 and 1280.</span></div></li>' +
      '<li><div><b>Component choice</b><span>Each element gets one component from this catalog with the reason and the alternatives it beat. <code>airiona suggest</code> searches by intent.</span></div></li>' +
      '<li><div><b>Data and states</b><span>Typed data contracts, sample data, loading, empty and error states.</span></div></li>' +
      '<li><div><b>Forms</b><span>Every field with its control, validators, messages, keyboard and autofill hints.</span></div></li>' +
      '<li><div><b>Spec check</b><span><code>airiona lint</code> rejects unknown components or inputs, fields without messages and sections without a mobile layout.</span></div></li>' +
      '<li><div><b>Build and look</b><span><code>airiona scaffold</code> writes the Angular page; <code>airiona shoot</code> builds it and captures 390, 768 and 1280 px screenshots to compare against the design.</span></div></li>' +
      '</ol><div class="cx-cards" style="margin-top:24px">' +
      codeBox('Start a page', 'In Claude Code, inside this repository:', '/airiona-page-convert docs/designs/checkout.png') +
      codeBox('Run the checks yourself', 'The same commands the skill runs.', 'node tools/page/airiona.mjs suggest "pick check-in and check-out"\nnode tools/page/airiona.mjs lint checkout\nnode tools/page/airiona.mjs scaffold checkout\nnode tools/page/airiona.mjs shoot checkout') +
      '</div>';
    if (window.Prism) window.Prism.highlightAllUnder($('#main'));
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var fw = t.closest('[data-fw]');
    if (fw) { state.fw = fw.dataset.fw; store.set('fw', state.fw); renderFw(); if (route().view === 'component') render(); return; }
    var kind = t.closest('[data-kind]');
    if (kind) { state.kind = kind.dataset.kind; store.set('kind', state.kind); renderKinds(); renderNav(); if (route().view === 'home') viewHome(); return; }
    var pick = t.closest('[data-pick]');
    if (pick) { e.preventDefault(); e.stopPropagation(); togglePick(pick.dataset.pick); return; }
    var w = t.closest('[data-width]');
    if (w) { state.width = w.dataset.width === 'fit' ? 'fit' : +w.dataset.width; store.set('width', state.width); document.querySelectorAll('[data-width]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === w)); }); Object.keys(frames).forEach(function (k) { sizeFrame(frames[k]); }); return; }
    var z = t.closest('[data-zoom]');
    if (z) { state.zoom = +z.dataset.zoom; document.querySelectorAll('[data-zoom]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === z)); }); Object.keys(frames).forEach(function (k) { sizeFrame(frames[k]); }); return; }
    var tab = t.closest('[data-tab]');
    if (tab) { state.tab = tab.dataset.tab; store.set('tab', state.tab); var c = bySlug(route().slug); if (c) renderPanel(c); return; }
    if (t.closest('#replay')) { Object.keys(frames).forEach(function (k) { frames[k].contentWindow.location.reload(); }); return; }
    if (t.closest('#open-new')) { var c2 = bySlug(route().slug); var fwOpen = state.fw === 'angular' ? 'angular' : 'react'; if (c2) location.href = previewUrl(c2, fwOpen); return; }
    if (t.closest('#export-png')) { var c3 = bySlug(route().slug); if (c3) exportPng(c3); return; }
    var cp = t.closest('[data-copy]');
    if (cp) { copy(cp.dataset.copy, cp.dataset.copy + ' copied'); return; }
    var ease = t.closest('[data-ease]');
    if (ease) { var i = ease.querySelector('i'); ease.classList.remove('is-run'); i.style.transition = 'none'; void i.offsetWidth; i.style.transition = 'transform ' + ease.dataset.dur + ' ' + ease.dataset.ease; ease.classList.add('is-run'); return; }
    if (t.closest('#modal-close') || t === $('#modal')) { $('#modal').hidden = true; return; }
    if (t.closest('#menu')) { var open = !$('#side').classList.contains('is-open'); $('#side').classList.toggle('is-open', open); $('#menu').setAttribute('aria-expanded', String(open)); return; }
    if (t.closest('#tray-clear')) { state.picks = []; store.set('picks', []); renderTray(); renderNav(); document.querySelectorAll('[data-pick]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Select'; }); return; }
    if (t.closest('#tray-imports')) { copy(importsFor(state.picks), 'Imports copied'); return; }
    if (t.closest('#tray-handoff')) { copy(handoffFor(state.picks), 'Handoff list copied'); return; }
  });
  function importsFor(names) {
    var cs = names.map(function (n) { return state.m.components.find(function (c) { return c.name === n; }); }).filter(Boolean);
    var react = 'import { ' + cs.map(function (c) { return c.name; }).join(', ') + " } from '@airiona/react';";
    var ng = 'import { ' + cs.filter(function (c) { return c.angular; }).map(function (c) { return c.angular.className; }).join(', ') + " } from '@airiona/ui';";
    return state.fw === 'react' ? react : state.fw === 'angular' ? ng : react + '\n' + ng;
  }
  function handoffFor(names) {
    return '## Airiona components for this screen\n\n| Component | Angular | Why it is here |\n|---|---|---|\n' + names.map(function (n) {
      var c = state.m.components.find(function (x) { return x.name === n; });
      return '| ' + c.name + ' | `' + (c.angular ? c.angular.selector : '') + '` | ' + c.summary.replace(/\|/g, '\\|') + ' |';
    }).join('\n') + '\n';
  }

  function onSearch(v) {
    state.q = v;
    renderNav();
    if (route().view === 'home') viewHome();
  }
  $('#search').addEventListener('input', function (e) { onSearch(e.target.value); });
  $('#search').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var first = visible()[0]; if (first) location.hash = first.slug; }
    if (e.key === 'Escape') { e.target.value = ''; onSearch(''); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); ($('#search').offsetParent ? $('#search') : $('#search-m')).focus(); }
    if (e.key === 'Escape' && !$('#modal').hidden) $('#modal').hidden = true;
  });
  window.addEventListener('hashchange', render);

  /* ---------------- boot ---------------- */
  fetch('data/manifest.json').then(function (r) {
    if (!r.ok) throw new Error('manifest ' + r.status);
    return r.json();
  }).then(function (m) {
    state.m = m;
    var side = $('#side');
    side.insertAdjacentHTML('afterbegin', '<label class="cx-search cx-search-mobile"><input id="search-m" type="search" placeholder="Search components" aria-label="Search components"></label>');
    $('#search-m').addEventListener('input', function (e) { $('#search').value = e.target.value; onSearch(e.target.value); });
    renderFw(); renderKinds(); renderTray(); render();
  }).catch(function (err) {
    $('#main').innerHTML = '<h1 class="cx-h1">The catalog could not load</h1><p class="cx-lede">' + esc(err.message) + '. Build it with <code>npm run catalog:build</code> and serve the folder over HTTP.</p>';
  });
})();
