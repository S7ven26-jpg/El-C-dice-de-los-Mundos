const storageKey = 'codice-cosmere-progress-v1';
const readList = document.querySelector('#reading-list');
const sectionNav = document.querySelector('#sections');
const statusFilter = document.querySelector('#status-filter');
const announcements = document.querySelector('#announcements');
const principal = groups.filter(group => group.section === 'principal')
  .flatMap(group => group.books.map(book => ({ book, group })));
const titles = new Map(groups.flatMap(group => group.books.map(book => [book[0], book[1]])));
const descriptions = {
  principal: 'Sigue la secuencia de Sanderson. Las pausas entre tomos del Archivo tienen su propia pestaña.',
  pausas: 'Puedes intercalar estas lecturas después de El camino de los reyes, Danzante del filo o Esquirla del amanecer.',
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
  document.querySelector('#next-context').textContent = next ? next.group.title : 'Explora las pausas y los complementos.';
}

function toggleBook(id, checked) {
  if (checked) completed.add(id);
  else completed.delete(id);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
  } catch {
    document.querySelector('#storage-note').textContent = 'Tu avance se conserva mientras esta página esté abierta.';
  }
  updateProgress();
  renderBooks();
  const focus = document.getElementById(`read-${id}`) || statusFilter;
  focus.focus({ preventScroll:true });
  announcements.textContent = `${titles.get(id)}: ${checked ? 'terminado' : 'pendiente'}.`;
}

function bookRow(book, nextId) {
  const [id, title, original, note, prerequisite] = book;
  const done = completed.has(id);
  const next = id === nextId;
  const row = el('li', `book${done ? ' book-read' : ''}${next ? ' book-next' : ''}`);
  const copy = el('div', 'book-copy');
  const heading = el('h4','',title);
  heading.id = `title-${id}`;
  copy.append(heading);
  if (original !== title) copy.append(el('p','original',original));
  if (note) copy.append(el('p','book-note',note));
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

function matchesFilter(book) {
  if (book[0] === 'secreta' && !completed.has('brazales') && !completed.has('secreta')) return false;
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

for (const [id, label] of sections) {
  const button = el('button','section-button',label);
  button.type = 'button';
  button.setAttribute('aria-pressed',String(id === section));
  button.addEventListener('click',() => {
    section = id;
    for (const option of sectionNav.children) option.setAttribute('aria-pressed',String(option === button));
    renderBooks();
  });
  sectionNav.append(button);
}
statusFilter.addEventListener('change',renderBooks);
updateProgress();
renderBooks();
