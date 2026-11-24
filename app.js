const storageKey = 'codice-cosmere-progress-v1';
const readList = document.querySelector('#reading-list');
const sectionNav = document.querySelector('#sections');
const statusFilter = document.querySelector('#status-filter');
const announcements = document.querySelector('#announcements');
const journeyStops = document.querySelector('#journey-stops');
const finishedBooks = document.querySelector('#finished-books');
const sagaBooks = document.querySelector('#saga-books');
const nextReading = document.querySelector('#next-reading');
const principalGroups = groups.filter(group => group.section === 'principal');
const principal = principalGroups
  .flatMap(group => group.books.map(book => ({ book, group })));
const routePositions = new Map(principal.map(({book}, index) => [book[0], index + 1]));
const titles = new Map(groups.flatMap(group => group.books.map(book => [book[0], book[1]])));
const descriptions = {
  principal: 'Tu orden personal desde Nacidos de la Bruma. La numeración se conserva al filtrar.',
  complementos: 'Relatos, formatos alternativos y novedades que puedes añadir al recorrido.',
  fuera: 'Una selección de lecturas de Sanderson en otros universos.',
};

function loadProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(stored)) return new Set(stored.filter(id => titles.has(id)));
  } catch {
    // Use the initial progress if storage is unavailable or malformed.
  }
  return new Set(['final']);
}

let completed = loadProgress();
let section = 'principal';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function updateProgress() {
  const count = principal.filter(({ book }) => completed.has(book[0])).length;
  const progress = document.querySelector('#reading-progress');
  const next = principal.find(({ book }) => !completed.has(book[0]));
  progress.max = principal.length;
  progress.value = count;
  document.querySelector('#progress-count').textContent = `${count} de ${principal.length}`;
  document.querySelector('#progress-heading').textContent = next ? next.book[1] : 'Ruta principal completada';
  document.querySelector('#next-context').textContent = next ? next.group.title : 'Explora los complementos.';
  nextReading.hidden = !next;
  nextReading.dataset.book = next?.book[0] ?? '';
  document.querySelector('#journey-count').textContent = `${count} de ${principal.length} en la ruta principal`;
  journeyStops.style.setProperty('--journey-fill', `${count / principal.length * 100}%`);
  renderJourney(next);
  renderSagaBooks(next);
}

function toggleBook(id, checked, fromSaga = false) {
  if (checked) completed.add(id);
  else completed.delete(id);
  const stored = saveReadingProgress();
  const focus = document.getElementById(`${fromSaga ? 'saga' : 'read'}-${id}`) || statusFilter;
  if (!document.querySelector('#atlas-book-dialog[open]') && document.querySelector('#journal-page').hidden) {
    focus.focus({ preventScroll:true });
  }
  announcements.textContent = `${titles.get(id)}: ${checked ? 'terminado' : 'pendiente'}.`;
  if (checked) document.dispatchEvent(new CustomEvent('reading-complete', {detail:id}));
  return stored;
}

function saveReadingProgress() {
  let stored = true;
  try {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
  } catch {
    stored = false;
    document.querySelector('#storage-note').textContent = 'Tu avance se conserva mientras esta página esté abierta.';
  }
  updateProgress();
  renderBooks();
  document.dispatchEvent(new Event('codice-progress'));
  return stored;
}

function renderJourney(next) {
  const stops = principalGroups.map(group => {
    const read = group.books.filter(book => completed.has(book[0])).length;
    const stage = el('li', 'journey-stop');
    const button = el('button','journey-node');
    button.type = 'button';
    const done = read === group.books.length;
    const current = group === next?.group;
    button.dataset.state = done ? 'read' : current ? 'current' : 'pending';
    if (current) button.setAttribute('aria-current','step');
    const symbol = el('span','node-symbol',done ? '✓' : current ? '✧' : '◇');
    symbol.setAttribute('aria-hidden','true');
    button.append(symbol, el('span','node-title',group.shortTitle), el('span','node-status',done ? 'Completado' : current ? 'En curso' : read ? `${read} de ${group.books.length}` : 'Pendiente'));
    button.setAttribute('aria-label',`${group.title}, ${read} de ${group.books.length} completados`);
    button.addEventListener('click', () => jumpToBook((group.books.find(book => !completed.has(book[0])) ?? group.books[0])[0]));
    stage.append(button);
    return stage;
  });
  journeyStops.replaceChildren(...stops);
  const archive = groups.flatMap(group => group.books).filter(book => completed.has(book[0]));
  finishedBooks.replaceChildren(...archive.map(book => el('li','finished-book',book[1])));
  document.querySelector('#finished-empty').hidden = archive.length > 0;
}

const trilogyNotes = [
  'Una historia de atracos y rebelión en la que se presentan Luthadel y la alomancia.',
  'Lee este tomo después de El Imperio Final. Puedes consultar aquí los mapas y los ocho metales básicos mientras avanzas.',
  'Último tomo de la primera era. En tu ruta, Elantris es la siguiente lectura al terminar la trilogía.',
];

function renderSagaBooks(next) {
  sagaBooks.replaceChildren(...principalGroups[0].books.map(([id, title, original], index) => {
    const done = completed.has(id);
    const card = el('article', 'saga-book');
    card.dataset.state = done ? 'read' : next?.book[0] === id ? 'current' : 'pending';
    card.append(el('p','eyebrow',`Tomo ${index + 1}`), el('h3','',title), el('p','original',original), el('p','muted',trilogyNotes[index]));
    const button = el('button','saga-read',done ? '✓ Terminado' : 'Marcar como leído');
    button.type = 'button';
    button.id = `saga-${id}`;
    button.setAttribute('aria-pressed',String(done));
    button.setAttribute('aria-label',`${done ? 'Terminado' : 'Marcar como leído'}: ${title}`);
    button.addEventListener('click', () => toggleBook(id, !done, true));
    card.append(button);
    return card;
  }));
}

function bookRow(book, nextId) {
  const [id, title, original, note, prerequisite] = book;
  const done = completed.has(id);
  const next = id === nextId;
  const row = el('li', `book${done ? ' book-read' : ''}${next ? ' book-next' : ''}`);
  const copy = el('div', 'book-copy');
  const position = routePositions.get(id);
  const heading = el('h4','');
  if (position) heading.append(el('span','book-position',`${position}. `));
  heading.append(title);
  heading.id = `title-${id}`;
  copy.append(heading);
  if (original !== title) copy.append(el('p','original',original));
  if (note) copy.append(el('p','book-note',note));
  const warning = readingWarning(id);
  if (warning) copy.append(el('p','book-note spoiler-note',warning));
  const action = el('div','book-action');
  if (prerequisite && !completed.has(prerequisite) && !done) {
    action.append(el('span','badge','Para más adelante'));
  } else if (next) {
    action.append(el('span','badge','Siguiente'));
  }
  const label = el('label','check-label');
  const box = el('input','');
  box.type = 'checkbox';
  box.id = `read-${id}`;
  box.checked = done;
  const status = el('span','status-text',done ? 'Terminado' : 'Marcar leído');
  status.id = `status-${id}`;
  box.setAttribute('aria-labelledby',`${status.id} ${heading.id}`);
  box.addEventListener('change',() => toggleBook(id,box.checked));
  label.append(box,status);
  action.append(label);
  row.append(copy,action);
  return row;
}

function readingWarning(id) {
  if (completed.has(id)) return '';
  if (id === 'secreta' && !completed.has('brazales')) {
    return 'Aviso sin spoilers: termina la Era 1 antes de abrir esta novela corta. Si quieres evitar detalles menores de Brazales de duelo, léela después de ese libro.';
  }
  if (id === 'antologia') return 'Esta antología contiene relatos que adelantan detalles de otras obras. Está situada al final de tu recorrido.';
  return '';
}

function matchesFilter(book) {
  if (statusFilter.value === 'all') return true;
  return completed.has(book[0]) === (statusFilter.value === 'read');
}

function renderBooks() {
  document.querySelector('#section-description').textContent = descriptions[section];
  const next = principal.find(({ book }) => !completed.has(book[0]));
  const fragment = document.createDocumentFragment();
  for (const group of groups.filter(group => group.section === section)) {
    const books = group.books.filter(matchesFilter);
    if (!books.length) continue;
    const card = el('article','group-card');
    const header = el('header','group-heading');
    header.append(el('h3','',group.title), el('p','muted',group.note));
    const list = el('ul','book-list');
    for (const book of books) list.append(bookRow(book,next?.book[0]));
    card.append(header,list);
    fragment.append(card);
  }
  if (!fragment.childNodes.length) fragment.append(el('p','empty','No hay lecturas con ese estado en esta sección.'));
  readList.replaceChildren(fragment);
}

function chooseSection(id) {
  section = id;
  for (const option of sectionNav.children) option.setAttribute('aria-pressed', String(option.dataset.section === section));
  renderBooks();
}

function jumpToBook(id) {
  statusFilter.value = completed.has(id) ? 'all' : 'pending';
  chooseSection('principal');
  const checkbox = document.getElementById(`read-${id}`);
  checkbox?.focus({ preventScroll:true });
  checkbox?.closest('.book').scrollIntoView({ block:'center' });
}

nextReading.addEventListener('click', event => {
  if (!nextReading.dataset.book) return;
  event.preventDefault();
  jumpToBook(nextReading.dataset.book);
});

for (const [id, label] of sections) {
  const button = el('button','section-button',label);
  button.type = 'button';
  button.setAttribute('aria-pressed',String(id === section));
  button.dataset.section = id;
  button.addEventListener('click',() => chooseSection(id));
  sectionNav.append(button);
}
statusFilter.addEventListener('change',renderBooks);
updateProgress();
renderBooks();
