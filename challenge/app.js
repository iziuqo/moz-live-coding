/**
 * Contacts screen: loads the contacts, shows them, and filters them as the user types.
 *
 * Screen states:  loading ──► ready (list | no results | empty)
 *                         └─► error ──(Retry)──► loading
 *
 * Safety: every value from the server is written with textContent, never innerHTML,
 * so a contact named "<img onerror=…>" shows up as text instead of running code.
 */
(function () {
  'use strict';

  const SKELETON_ROW_COUNT = 6;
  const STATUS_DELAY_MS = 250; // Wait for a pause in typing before screen readers announce the count.
  const ANIMATED_ROW_LIMIT = 12; // Only the first rows stagger in; the rest are below the fold.

  const form = document.getElementById('contact-search');
  const input = document.getElementById('search-input');
  const status = document.getElementById('search-status');
  const announcer = document.getElementById('search-announcer');
  const list = document.getElementById('contact-list');
  const message = document.getElementById('list-message');
  const rowTemplate = document.getElementById('contact-row-template');

  /** Contacts plus their pre-computed search text, filled once loading succeeds. */
  let searchIndex = [];
  let statusTimer;

  /* ---------- Text matching ---------- */

  /** Lowercases one character and strips its accent, so "é" matches "e". */
  function foldChar(char) {
    return char.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function fold(text) {
    return Array.from(text, foldChar).join('');
  }

  function digitsOf(text) {
    return text.replace(/\D/g, '');
  }

  /** Splits the query into words: "work alex" must match both words, in any field. */
  function termsOf(query) {
    return fold(query).split(/\s+/).filter(Boolean);
  }

  function buildSearchIndex(contacts) {
    return contacts.map(function (contact) {
      return {
        contact: contact,
        text: fold([contact.name, contact.phone, contact.label].join(' ')),
        phoneDigits: digitsOf(contact.phone)
      };
    });
  }

  /** A term matches the text, or, if it has digits, the phone number with formatting ignored. */
  function termMatches(entry, term) {
    const termDigits = digitsOf(term);
    return entry.text.includes(term) ||
      (termDigits.length > 0 && entry.phoneDigits.includes(termDigits));
  }

  function filterContacts(terms) {
    return searchIndex
      .filter(function (entry) {
        return terms.every(function (term) { return termMatches(entry, term); });
      })
      .map(function (entry) { return entry.contact; });
  }

  /* ---------- Rendering ---------- */

  /**
   * Writes `text` into `target`, wrapping the parts that match the search in <mark>,
   * so users can see why each row matched. Built from text nodes only, so it stays XSS-safe.
   */
  function renderHighlighted(target, text, terms) {
    const chars = Array.from(text);
    const folded = chars.map(foldChar);
    const isMatch = new Array(chars.length).fill(false);

    terms.forEach(function (term) {
      const termChars = Array.from(term);
      for (let start = 0; start + termChars.length <= folded.length; start++) {
        const found = termChars.every(function (char, offset) { return folded[start + offset] === char; });
        if (found) termChars.forEach(function (_, offset) { isMatch[start + offset] = true; });
      }
    });

    target.replaceChildren();
    let run = '';
    chars.forEach(function (char, i) {
      run += char;
      const runEnds = i === chars.length - 1 || isMatch[i + 1] !== isMatch[i];
      if (!runEnds) return;
      if (isMatch[i]) {
        const mark = document.createElement('mark');
        mark.textContent = run;
        target.appendChild(mark);
      } else {
        target.appendChild(document.createTextNode(run));
      }
      run = '';
    });
  }

  function createRow(contact, terms, animationIndex) {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    renderHighlighted(row.querySelector('.contact-name'), contact.name, terms);
    renderHighlighted(row.querySelector('.contact-detail'), contact.phone, terms);
    renderHighlighted(row.querySelector('.badge-label'), contact.label, terms);

    if (animationIndex !== undefined && animationIndex < ANIMATED_ROW_LIMIT) {
      row.classList.add('is-entering');
      row.style.setProperty('--row-index', animationIndex);
    }
    return row;
  }

  /** Shows the list, or a message in its place. Only one of the two is ever visible. */
  function showMessage(children) {
    list.hidden = children !== null;
    message.hidden = children === null;
    message.replaceChildren.apply(message, children || []);
  }

  function textElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
  }

  /** `variant` is a Bootstrap button class, e.g. 'btn-outline-secondary'. */
  function actionButton(label, variant, onClick) {
    const button = textElement('button', 'btn btn-sm ' + variant, label);
    button.type = 'button';
    button.addEventListener('click', onClick);
    return button;
  }

  /** Updates the visible count now; screen readers hear it once typing pauses. */
  function setStatus(text, { announceNow = false } = {}) {
    status.textContent = text;
    clearTimeout(statusTimer);
    if (announceNow) announcer.textContent = text;
    else statusTimer = setTimeout(function () { announcer.textContent = text; }, STATUS_DELAY_MS);
  }

  function pluralize(count, singular, plural) {
    return count + ' ' + (count === 1 ? singular : plural);
  }

  /** Renders the list for the current query. `animate` is only true right after loading. */
  function renderResults({ animate = false } = {}) {
    const query = input.value.trim();
    const terms = termsOf(query);
    const results = filterContacts(terms);

    if (searchIndex.length === 0) {
      showMessage([textElement('p', 'list-message-text', 'No contacts yet.')]);
      setStatus('No contacts yet.', { announceNow: animate });
      return;
    }

    if (results.length === 0) {
      showMessage([
        textElement('p', 'list-message-text', 'No contacts match “' + query + '”.'),
        actionButton('Clear search', 'btn-outline-secondary', clearSearch)
      ]);
      setStatus('No contacts match “' + query + '”.');
      return;
    }

    const rows = document.createDocumentFragment();
    results.forEach(function (contact, i) {
      rows.appendChild(createRow(contact, terms, animate ? i : undefined));
    });
    list.replaceChildren(rows);
    showMessage(null);

    setStatus(
      terms.length === 0
        ? pluralize(searchIndex.length, 'contact', 'contacts')
        : pluralize(results.length, 'contact matches', 'contacts match') + ' “' + query + '”',
      { announceNow: animate }
    );
  }

  function renderLoading() {
    const skeletonRow = document.createElement('li');
    skeletonRow.className = 'list-group-item placeholder-glow';
    skeletonRow.setAttribute('aria-hidden', 'true');
    skeletonRow.append(
      textElement('span', 'placeholder col-5 d-block mb-2', ''),
      textElement('span', 'placeholder placeholder-sm col-3 d-block', '')
    );

    const rows = document.createDocumentFragment();
    for (let i = 0; i < SKELETON_ROW_COUNT; i++) rows.appendChild(skeletonRow.cloneNode(true));
    list.replaceChildren(rows);
    list.setAttribute('aria-busy', 'true');
    showMessage(null);
    setStatus('Loading contacts…', { announceNow: true });
  }

  function renderError() {
    const alert = textElement('div', 'alert alert-danger d-flex justify-content-between align-items-center', '');
    alert.setAttribute('role', 'alert');
    alert.append(
      textElement('span', '', 'We couldn’t load your contacts.'),
      actionButton('Try again', 'btn-danger', start)
    );
    list.setAttribute('aria-busy', 'false');
    showMessage([alert]);
    setStatus('', { announceNow: true });
  }

  /* ---------- Search interactions ---------- */

  /** Keeps the query in the URL (?q=…), so a search survives reload and can be shared. */
  function syncQueryToUrl() {
    const url = new URL(window.location.href);
    const query = input.value.trim();
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }

  function onSearchInput() {
    syncQueryToUrl();
    if (searchIndex.length > 0) renderResults(); // While loading, the query is applied on arrival.
  }

  function clearSearch() {
    input.value = '';
    onSearchInput();
    input.focus();
  }

  function isTypingInField(target) {
    return target.closest('input, textarea, select, [contenteditable="true"]') !== null;
  }

  input.addEventListener('input', onSearchInput);

  // Escape clears the search (most browsers do this natively; this makes it consistent).
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && input.value) {
      event.preventDefault();
      clearSearch();
    }
  });

  // Enter would reload the page; the list already updates as you type.
  form.addEventListener('submit', function (event) { event.preventDefault(); });

  // "/" jumps to search from anywhere on the page, a common shortcut.
  document.addEventListener('keydown', function (event) {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTypingInField(event.target)) return;
    event.preventDefault();
    input.focus();
    input.select();
  });

  /* ---------- Start ---------- */

  function start() {
    renderLoading();
    loadContacts()
      .then(function (contacts) {
        searchIndex = buildSearchIndex(contacts);
        list.setAttribute('aria-busy', 'false');
        renderResults({ animate: true });
      })
      .catch(renderError);
  }

  input.value = new URL(window.location.href).searchParams.get('q') || '';
  start();
})();
