// Renders the list in assets/publications.js on publications.html.
(function () {
  var ME = 'Hao Xue';
  var TYPES = [
    { key: 'all', label: 'All' },
    { key: 'conference', label: 'Conference' },
    { key: 'journal', label: 'Journal' },
    { key: 'patent', label: 'Patents' }
  ];
  var pubs = window.PUBLICATIONS || [];
  var state = { type: 'all', query: '' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function linkFor(p) {
    var l = p.links || {};
    return l.pdf || l.doi || l.url ||
      'https://scholar.google.com/scholar?q=' + encodeURIComponent('"' + p.title + '"');
  }

  function itemHTML(p) {
    var authors = p.authors.map(function (a) {
      return a === ME ? '<strong>' + esc(a) + '</strong>' : esc(a);
    }).join(', ');
    var links = p.links || {};
    var extra = [];
    if (links.pdf) extra.push('<a href="' + esc(links.pdf) + '" target="_blank" rel="noopener">PDF</a>');
    if (links.code) extra.push('<a href="' + esc(links.code) + '" target="_blank" rel="noopener">Code</a>');
    if (links.video) extra.push('<a href="' + esc(links.video) + '" target="_blank" rel="noopener">Video</a>');
    return '<li class="pub-item">' +
      '<div class="pub-meta">' +
        '<span class="pub-badge pub-badge--' + p.type + '">' + esc(p.abbr) + '</span>' +
      '</div>' +
      '<div class="pub-body">' +
        '<div class="pub-title"><a href="' + esc(linkFor(p)) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' +
          (p.award ? '<span class="pub-award"><i class="fas fa-trophy" aria-hidden="true"></i>' + esc(p.award) + '</span>' : '') +
        '</div>' +
        '<div class="pub-authors">' + authors + '</div>' +
        '<div class="pub-venue">' + esc(p.venue) + '</div>' +
        (extra.length ? '<div class="pub-links">' + extra.join('') + '</div>' : '') +
      '</div>' +
    '</li>';
  }

  function matches(p) {
    if (state.type !== 'all' && p.type !== state.type) return false;
    if (!state.query) return true;
    var hay = (p.title + ' ' + p.authors.join(' ') + ' ' + p.venue + ' ' + p.abbr + ' ' + p.id + ' ' + p.year).toLowerCase();
    return state.query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function render() {
    var list = document.getElementById('pub-list');
    var status = document.getElementById('pub-status');
    var shown = pubs.filter(matches);
    var years = [];
    shown.forEach(function (p) { if (years.indexOf(p.year) === -1) years.push(p.year); });
    years.sort(function (a, b) { return b - a; });

    if (!shown.length) {
      list.innerHTML = '<p class="pub-empty">No publications match “' + esc(state.query) +
        '”. Try another word, or clear the search to see the full list.</p>';
    } else {
      list.innerHTML = years.map(function (y) {
        var group = shown.filter(function (p) { return p.year === y; });
        return '<div class="pub-year">' +
          '<h2 class="pub-year-heading">' + y + '</h2>' +
          '<ol class="pub-items">' + group.map(itemHTML).join('') + '</ol></div>';
      }).join('');
    }
    var filtered = state.type !== 'all' || state.query;
    status.textContent = filtered ? 'Showing ' + shown.length + ' of ' + pubs.length : '';
  }

  function count(key) {
    return key === 'all' ? pubs.length : pubs.filter(function (p) { return p.type === key; }).length;
  }

  function init() {
    var bar = document.getElementById('pub-filters');
    bar.innerHTML = TYPES.map(function (t) {
      return '<button type="button" class="pub-filter" data-type="' + t.key + '" aria-pressed="' +
        (t.key === state.type) + '">' + t.label + '<span class="pub-filter-count">' + count(t.key) + '</span></button>';
    }).join('');
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.pub-filter');
      if (!btn) return;
      state.type = btn.getAttribute('data-type');
      bar.querySelectorAll('.pub-filter').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      render();
    });
    document.getElementById('pub-search').addEventListener('input', function (e) {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
