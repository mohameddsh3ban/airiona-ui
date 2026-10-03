/* Loaded by every preview page (React and Angular) when the catalog frames it.
   Reports the page height to the catalog, applies zoom, and answers PNG snapshot requests. */
(function () {
  if (window.parent === window) return;
  var stage = function () { return document.getElementById('root') || document.getElementById('solo-stage') || document.body; };
  var last = 0;
  function post() {
    var h = Math.ceil(document.documentElement.scrollHeight);
    if (h === last) return;
    last = h;
    window.parent.postMessage({ type: 'airiona:size', frame: window.name, h: h }, '*');
  }
  if (window.ResizeObserver) new ResizeObserver(post).observe(document.documentElement);
  window.addEventListener('load', function () { post(); setTimeout(post, 400); setTimeout(post, 1500); });

  var loader = null;
  function loadCapture() {
    if (window.htmlToImage) return Promise.resolve(window.htmlToImage);
    if (!loader) loader = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js';
      s.integrity = 'sha384-UbfRVKN3/elS1r7JcK2FhmPP+KlJ4CvYwbyYD7tH+uTkbT9bNJr9eJeQ0FoFbAgz';
      s.crossOrigin = 'anonymous';
      s.onload = function () { resolve(window.htmlToImage); };
      s.onerror = function () { reject(new Error('Could not load the capture library.')); };
      document.head.appendChild(s);
    });
    return loader;
  }

  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'airiona:snapshot') {
      var el = stage();
      var bg = getComputedStyle(document.body).backgroundColor;
      loadCapture()
        .then(function (lib) { return lib.toPng(el, { pixelRatio: d.scale || 2, backgroundColor: bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : '#eceef2', cacheBust: true }); })
        .then(function (url) { window.parent.postMessage({ type: 'airiona:snapshot', frame: window.name, id: d.id, url: url, w: el.offsetWidth, h: el.offsetHeight }, '*'); })
        .catch(function (err) { window.parent.postMessage({ type: 'airiona:snapshot', frame: window.name, id: d.id, error: String(err && err.message || err) }, '*'); });
    }
  });
})();
